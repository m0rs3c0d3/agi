import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import * as THREE from 'three'
import './NeuralNetwork.css'

interface Neuron {
  position: THREE.Vector3
  velocity: THREE.Vector3
  basePosition: THREE.Vector3
  phase: number
}

export default function NeuralNetwork() {
  const containerRef = useRef<HTMLDivElement>(null)
  const touchRef = useRef<{ x: number; y: number; active: boolean }>({ x: 0, y: 0, active: false })

  useEffect(() => {
    if (!containerRef.current) return

    const container = containerRef.current
    const width = container.clientWidth
    const height = container.clientHeight

    // Scene setup
    const scene = new THREE.Scene()
    scene.background = new THREE.Color(0x0a0a0f)

    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000)
    camera.position.z = 30

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setSize(width, height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    container.appendChild(renderer.domElement)

    // Create neurons
    const neuronCount = 120
    const neurons: Neuron[] = []
    const positions = new Float32Array(neuronCount * 3)
    const colors = new Float32Array(neuronCount * 3)

    for (let i = 0; i < neuronCount; i++) {
      const x = (Math.random() - 0.5) * 40
      const y = (Math.random() - 0.5) * 40
      const z = (Math.random() - 0.5) * 20

      neurons.push({
        position: new THREE.Vector3(x, y, z),
        velocity: new THREE.Vector3(0, 0, 0),
        basePosition: new THREE.Vector3(x, y, z),
        phase: Math.random() * Math.PI * 2
      })

      positions[i * 3] = x
      positions[i * 3 + 1] = y
      positions[i * 3 + 2] = z

      // Purple/cyan gradient colors
      const t = Math.random()
      colors[i * 3] = 0.4 + t * 0.4     // R
      colors[i * 3 + 1] = 0.2 + t * 0.3 // G
      colors[i * 3 + 2] = 0.8 + t * 0.2 // B
    }

    // Neuron particles
    const neuronGeometry = new THREE.BufferGeometry()
    neuronGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    neuronGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))

    const neuronMaterial = new THREE.PointsMaterial({
      size: 0.4,
      vertexColors: true,
      transparent: true,
      opacity: 0.9,
      sizeAttenuation: true
    })

    const neuronPoints = new THREE.Points(neuronGeometry, neuronMaterial)
    scene.add(neuronPoints)

    // Connection lines
    const lineGeometry = new THREE.BufferGeometry()
    const lineMaterial = new THREE.LineBasicMaterial({
      color: 0x6366f1,
      transparent: true,
      opacity: 0.15
    })
    const lines = new THREE.LineSegments(lineGeometry, lineMaterial)
    scene.add(lines)

    // Touch/mouse handlers
    const getPointerPosition = (clientX: number, clientY: number) => {
      const rect = container.getBoundingClientRect()
      return {
        x: ((clientX - rect.left) / rect.width) * 2 - 1,
        y: -((clientY - rect.top) / rect.height) * 2 + 1
      }
    }

    const handlePointerDown = (e: PointerEvent) => {
      const pos = getPointerPosition(e.clientX, e.clientY)
      touchRef.current = { x: pos.x, y: pos.y, active: true }
    }

    const handlePointerMove = (e: PointerEvent) => {
      if (!touchRef.current.active) return
      const pos = getPointerPosition(e.clientX, e.clientY)
      touchRef.current.x = pos.x
      touchRef.current.y = pos.y
    }

    const handlePointerUp = () => {
      touchRef.current.active = false
    }

    container.addEventListener('pointerdown', handlePointerDown)
    container.addEventListener('pointermove', handlePointerMove)
    container.addEventListener('pointerup', handlePointerUp)
    container.addEventListener('pointerleave', handlePointerUp)

    // Animation
    let time = 0
    const connectionDistance = 8

    const animate = () => {
      time += 0.008

      const positionArray = neuronGeometry.attributes.position.array as Float32Array
      const linePositions: number[] = []

      // Update neurons
      for (let i = 0; i < neurons.length; i++) {
        const neuron = neurons[i]

        // Wavy movement
        const waveX = Math.sin(time + neuron.phase) * 1.5
        const waveY = Math.cos(time * 0.8 + neuron.phase * 1.3) * 1.5
        const waveZ = Math.sin(time * 0.6 + neuron.phase * 0.7) * 1

        neuron.position.x = neuron.basePosition.x + waveX
        neuron.position.y = neuron.basePosition.y + waveY
        neuron.position.z = neuron.basePosition.z + waveZ

        // Touch interaction - push neurons away or attract
        if (touchRef.current.active) {
          const touchX = touchRef.current.x * 25
          const touchY = touchRef.current.y * 25

          const dx = neuron.position.x - touchX
          const dy = neuron.position.y - touchY
          const dist = Math.sqrt(dx * dx + dy * dy)

          if (dist < 15) {
            const force = (15 - dist) / 15 * 3
            neuron.position.x += (dx / dist) * force
            neuron.position.y += (dy / dist) * force
          }
        }

        positionArray[i * 3] = neuron.position.x
        positionArray[i * 3 + 1] = neuron.position.y
        positionArray[i * 3 + 2] = neuron.position.z
      }

      // Update connections
      for (let i = 0; i < neurons.length; i++) {
        for (let j = i + 1; j < neurons.length; j++) {
          const dist = neurons[i].position.distanceTo(neurons[j].position)
          if (dist < connectionDistance) {
            linePositions.push(
              neurons[i].position.x, neurons[i].position.y, neurons[i].position.z,
              neurons[j].position.x, neurons[j].position.y, neurons[j].position.z
            )
          }
        }
      }

      lineGeometry.setAttribute(
        'position',
        new THREE.Float32BufferAttribute(linePositions, 3)
      )

      neuronGeometry.attributes.position.needsUpdate = true

      // Slow rotation
      scene.rotation.y = time * 0.1
      scene.rotation.x = Math.sin(time * 0.2) * 0.1

      renderer.render(scene, camera)
      requestAnimationFrame(animate)
    }

    animate()

    // Resize handler
    const handleResize = () => {
      const w = container.clientWidth
      const h = container.clientHeight
      camera.aspect = w / h
      camera.updateProjectionMatrix()
      renderer.setSize(w, h)
    }

    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
      container.removeEventListener('pointerdown', handlePointerDown)
      container.removeEventListener('pointermove', handlePointerMove)
      container.removeEventListener('pointerup', handlePointerUp)
      container.removeEventListener('pointerleave', handlePointerUp)
      container.removeChild(renderer.domElement)
      renderer.dispose()
    }
  }, [])

  return (
    <div className="neural-page">
      <div className="neural-container" ref={containerRef} />
      <div className="neural-overlay">
        <Link to="/" className="back-button">← Back</Link>
        <h1>Neural Network</h1>
        <p>Touch and drag to interact</p>
      </div>
    </div>
  )
}
