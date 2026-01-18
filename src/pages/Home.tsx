import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import './Home.css'

interface Neuron {
  position: THREE.Vector3
  basePosition: THREE.Vector3
  phase: number
}

function Home() {
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

    // Create neurons with warm glow colors
    const neuronCount = 100
    const neurons: Neuron[] = []
    const positions = new Float32Array(neuronCount * 3)
    const colors = new Float32Array(neuronCount * 3)
    const sizes = new Float32Array(neuronCount)

    for (let i = 0; i < neuronCount; i++) {
      const x = (Math.random() - 0.5) * 50
      const y = (Math.random() - 0.5) * 50
      const z = (Math.random() - 0.5) * 25

      neurons.push({
        position: new THREE.Vector3(x, y, z),
        basePosition: new THREE.Vector3(x, y, z),
        phase: Math.random() * Math.PI * 2
      })

      positions[i * 3] = x
      positions[i * 3 + 1] = y
      positions[i * 3 + 2] = z

      // Cool glow colors: cyan, blue, green
      const colorChoice = Math.random()
      if (colorChoice < 0.33) {
        // Cyan
        colors[i * 3] = 0.0 + Math.random() * 0.3
        colors[i * 3 + 1] = 0.8 + Math.random() * 0.2
        colors[i * 3 + 2] = 1.0
      } else if (colorChoice < 0.66) {
        // Blue/purple
        colors[i * 3] = 0.4 + Math.random() * 0.3
        colors[i * 3 + 1] = 0.2 + Math.random() * 0.3
        colors[i * 3 + 2] = 1.0
      } else {
        // Green/teal
        colors[i * 3] = 0.1 + Math.random() * 0.2
        colors[i * 3 + 1] = 0.9 + Math.random() * 0.1
        colors[i * 3 + 2] = 0.5 + Math.random() * 0.3
      }

      sizes[i] = 0.3 + Math.random() * 0.4
    }

    // Custom shader for glowing particles
    const neuronGeometry = new THREE.BufferGeometry()
    neuronGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    neuronGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))
    neuronGeometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1))

    const neuronMaterial = new THREE.PointsMaterial({
      size: 0.6,
      vertexColors: true,
      transparent: true,
      opacity: 0.9,
      sizeAttenuation: true,
      blending: THREE.AdditiveBlending
    })

    const neuronPoints = new THREE.Points(neuronGeometry, neuronMaterial)
    scene.add(neuronPoints)

    // Glow layer - larger, more transparent particles
    const glowPositions = new Float32Array(positions)
    const glowColors = new Float32Array(colors)
    const glowGeometry = new THREE.BufferGeometry()
    glowGeometry.setAttribute('position', new THREE.BufferAttribute(glowPositions, 3))
    glowGeometry.setAttribute('color', new THREE.BufferAttribute(glowColors, 3))

    const glowMaterial = new THREE.PointsMaterial({
      size: 2.0,
      vertexColors: true,
      transparent: true,
      opacity: 0.15,
      sizeAttenuation: true,
      blending: THREE.AdditiveBlending
    })

    const glowPoints = new THREE.Points(glowGeometry, glowMaterial)
    scene.add(glowPoints)

    // Connection lines with cool color
    const lineGeometry = new THREE.BufferGeometry()
    const lineMaterial = new THREE.LineBasicMaterial({
      color: 0x00d4ff,
      transparent: true,
      opacity: 0.12,
      blending: THREE.AdditiveBlending
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
    const connectionDistance = 10

    const animate = () => {
      time += 0.006

      const positionArray = neuronGeometry.attributes.position.array as Float32Array
      const glowPositionArray = glowGeometry.attributes.position.array as Float32Array
      const linePositions: number[] = []

      // Update neurons
      for (let i = 0; i < neurons.length; i++) {
        const neuron = neurons[i]

        // Wavy movement
        const waveX = Math.sin(time + neuron.phase) * 2
        const waveY = Math.cos(time * 0.7 + neuron.phase * 1.2) * 2
        const waveZ = Math.sin(time * 0.5 + neuron.phase * 0.8) * 1.5

        neuron.position.x = neuron.basePosition.x + waveX
        neuron.position.y = neuron.basePosition.y + waveY
        neuron.position.z = neuron.basePosition.z + waveZ

        // Touch interaction
        if (touchRef.current.active) {
          const touchX = touchRef.current.x * 30
          const touchY = touchRef.current.y * 30

          const dx = neuron.position.x - touchX
          const dy = neuron.position.y - touchY
          const dist = Math.sqrt(dx * dx + dy * dy)

          if (dist < 18) {
            const force = (18 - dist) / 18 * 4
            neuron.position.x += (dx / dist) * force
            neuron.position.y += (dy / dist) * force
          }
        }

        positionArray[i * 3] = neuron.position.x
        positionArray[i * 3 + 1] = neuron.position.y
        positionArray[i * 3 + 2] = neuron.position.z

        glowPositionArray[i * 3] = neuron.position.x
        glowPositionArray[i * 3 + 1] = neuron.position.y
        glowPositionArray[i * 3 + 2] = neuron.position.z
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
      glowGeometry.attributes.position.needsUpdate = true

      // Gentle rotation
      scene.rotation.y = time * 0.08
      scene.rotation.x = Math.sin(time * 0.15) * 0.08

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
    <div className="home-neural">
      <div className="neural-bg" ref={containerRef} />
      <div className="home-content">
        <h1>AGI</h1>
        <p>Touch to interact</p>
      </div>
    </div>
  )
}

export default Home
