import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import './Home.css'

interface Neuron {
  position: THREE.Vector3
  basePosition: THREE.Vector3
  phase: number
}

interface TrailParticle {
  position: THREE.Vector3
  velocity: THREE.Vector3
  life: number
  maxLife: number
}

function Home() {
  const containerRef = useRef<HTMLDivElement>(null)
  const touchRef = useRef<{ x: number; y: number; active: boolean; prevX: number; prevY: number }>({
    x: 0, y: 0, active: false, prevX: 0, prevY: 0
  })

  useEffect(() => {
    if (!containerRef.current) return

    const container = containerRef.current
    const width = container.clientWidth
    const height = container.clientHeight

    // Scene setup
    const scene = new THREE.Scene()
    scene.background = new THREE.Color(0x050508)

    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000)
    camera.position.z = 30

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setSize(width, height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    container.appendChild(renderer.domElement)

    // Create neurons
    const neuronCount = 80
    const neurons: Neuron[] = []
    const positions = new Float32Array(neuronCount * 3)
    const colors = new Float32Array(neuronCount * 3)

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
        colors[i * 3] = 0.0 + Math.random() * 0.3
        colors[i * 3 + 1] = 0.8 + Math.random() * 0.2
        colors[i * 3 + 2] = 1.0
      } else if (colorChoice < 0.66) {
        colors[i * 3] = 0.4 + Math.random() * 0.3
        colors[i * 3 + 1] = 0.2 + Math.random() * 0.3
        colors[i * 3 + 2] = 1.0
      } else {
        colors[i * 3] = 0.1 + Math.random() * 0.2
        colors[i * 3 + 1] = 0.9 + Math.random() * 0.1
        colors[i * 3 + 2] = 0.5 + Math.random() * 0.3
      }
    }

    // Neuron particles
    const neuronGeometry = new THREE.BufferGeometry()
    neuronGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    neuronGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))

    const neuronMaterial = new THREE.PointsMaterial({
      size: 0.5,
      vertexColors: true,
      transparent: true,
      opacity: 0.9,
      sizeAttenuation: true,
      blending: THREE.AdditiveBlending
    })

    const neuronPoints = new THREE.Points(neuronGeometry, neuronMaterial)
    scene.add(neuronPoints)

    // Glow layer
    const glowGeometry = new THREE.BufferGeometry()
    glowGeometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(positions), 3))
    glowGeometry.setAttribute('color', new THREE.BufferAttribute(new Float32Array(colors), 3))

    const glowMaterial = new THREE.PointsMaterial({
      size: 2.5,
      vertexColors: true,
      transparent: true,
      opacity: 0.12,
      sizeAttenuation: true,
      blending: THREE.AdditiveBlending
    })

    const glowPoints = new THREE.Points(glowGeometry, glowMaterial)
    scene.add(glowPoints)

    // Trail system
    const maxTrailParticles = 200
    const trailParticles: TrailParticle[] = []
    const trailPositions = new Float32Array(maxTrailParticles * 3)
    const trailColors = new Float32Array(maxTrailParticles * 3)
    const trailSizes = new Float32Array(maxTrailParticles)

    const trailGeometry = new THREE.BufferGeometry()
    trailGeometry.setAttribute('position', new THREE.BufferAttribute(trailPositions, 3))
    trailGeometry.setAttribute('color', new THREE.BufferAttribute(trailColors, 3))
    trailGeometry.setAttribute('size', new THREE.BufferAttribute(trailSizes, 1))

    const trailMaterial = new THREE.PointsMaterial({
      size: 1.2,
      vertexColors: true,
      transparent: true,
      opacity: 0.8,
      sizeAttenuation: true,
      blending: THREE.AdditiveBlending
    })

    const trailPoints = new THREE.Points(trailGeometry, trailMaterial)
    scene.add(trailPoints)

    // Trail glow layer
    const trailGlowGeometry = new THREE.BufferGeometry()
    trailGlowGeometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(maxTrailParticles * 3), 3))
    trailGlowGeometry.setAttribute('color', new THREE.BufferAttribute(new Float32Array(maxTrailParticles * 3), 3))

    const trailGlowMaterial = new THREE.PointsMaterial({
      size: 4.0,
      vertexColors: true,
      transparent: true,
      opacity: 0.2,
      sizeAttenuation: true,
      blending: THREE.AdditiveBlending
    })

    const trailGlowPoints = new THREE.Points(trailGlowGeometry, trailGlowMaterial)
    scene.add(trailGlowPoints)

    // Connection lines
    const lineGeometry = new THREE.BufferGeometry()
    const lineMaterial = new THREE.LineBasicMaterial({
      color: 0x00d4ff,
      transparent: true,
      opacity: 0.08,
      blending: THREE.AdditiveBlending
    })
    const lines = new THREE.LineSegments(lineGeometry, lineMaterial)
    scene.add(lines)

    // Spawn trail particle
    const spawnTrailParticle = (x: number, y: number, vx: number, vy: number) => {
      if (trailParticles.length >= maxTrailParticles) {
        trailParticles.shift()
      }

      const speed = Math.sqrt(vx * vx + vy * vy)
      const life = 60 + speed * 20

      trailParticles.push({
        position: new THREE.Vector3(x, y, (Math.random() - 0.5) * 5),
        velocity: new THREE.Vector3(vx * 0.3 + (Math.random() - 0.5) * 0.5, vy * 0.3 + (Math.random() - 0.5) * 0.5, (Math.random() - 0.5) * 0.2),
        life: life,
        maxLife: life
      })
    }

    // Touch handlers
    const getPointerPosition = (clientX: number, clientY: number) => {
      const rect = container.getBoundingClientRect()
      return {
        x: ((clientX - rect.left) / rect.width) * 2 - 1,
        y: -((clientY - rect.top) / rect.height) * 2 + 1
      }
    }

    const handlePointerDown = (e: PointerEvent) => {
      const pos = getPointerPosition(e.clientX, e.clientY)
      touchRef.current = { x: pos.x, y: pos.y, active: true, prevX: pos.x, prevY: pos.y }
    }

    const handlePointerMove = (e: PointerEvent) => {
      const pos = getPointerPosition(e.clientX, e.clientY)

      if (touchRef.current.active) {
        const vx = pos.x - touchRef.current.prevX
        const vy = pos.y - touchRef.current.prevY

        // Spawn multiple trail particles based on movement speed
        const speed = Math.sqrt(vx * vx + vy * vy)
        const particlesToSpawn = Math.min(Math.floor(speed * 50) + 1, 5)

        for (let i = 0; i < particlesToSpawn; i++) {
          const t = i / particlesToSpawn
          const px = touchRef.current.prevX + vx * t
          const py = touchRef.current.prevY + vy * t
          spawnTrailParticle(px * 30, py * 30, vx * 30, vy * 30)
        }

        touchRef.current.prevX = pos.x
        touchRef.current.prevY = pos.y
      }

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
    const connectionDistance = 12

    const animate = () => {
      time += 0.005

      const positionArray = neuronGeometry.attributes.position.array as Float32Array
      const glowPositionArray = glowGeometry.attributes.position.array as Float32Array
      const linePositions: number[] = []

      // Update neurons with fluid movement
      for (let i = 0; i < neurons.length; i++) {
        const neuron = neurons[i]

        const waveX = Math.sin(time + neuron.phase) * 2.5 + Math.sin(time * 1.5 + neuron.phase * 2) * 1
        const waveY = Math.cos(time * 0.8 + neuron.phase * 1.3) * 2.5 + Math.cos(time * 1.2 + neuron.phase) * 1
        const waveZ = Math.sin(time * 0.6 + neuron.phase * 0.9) * 2

        neuron.position.x = neuron.basePosition.x + waveX
        neuron.position.y = neuron.basePosition.y + waveY
        neuron.position.z = neuron.basePosition.z + waveZ

        // Touch interaction - fluid push
        if (touchRef.current.active) {
          const touchX = touchRef.current.x * 30
          const touchY = touchRef.current.y * 30

          const dx = neuron.position.x - touchX
          const dy = neuron.position.y - touchY
          const dist = Math.sqrt(dx * dx + dy * dy)

          if (dist < 20 && dist > 0.1) {
            const force = (20 - dist) / 20 * 5
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

      // Update trail particles
      const trailPosArray = trailGeometry.attributes.position.array as Float32Array
      const trailColArray = trailGeometry.attributes.color.array as Float32Array
      const trailSizeArray = trailGeometry.attributes.size.array as Float32Array
      const trailGlowPosArray = trailGlowGeometry.attributes.position.array as Float32Array
      const trailGlowColArray = trailGlowGeometry.attributes.color.array as Float32Array

      for (let i = 0; i < maxTrailParticles; i++) {
        if (i < trailParticles.length) {
          const particle = trailParticles[i]

          // Update position with velocity
          particle.position.add(particle.velocity)
          particle.velocity.multiplyScalar(0.96) // Damping
          particle.life -= 1

          const lifeRatio = particle.life / particle.maxLife

          trailPosArray[i * 3] = particle.position.x
          trailPosArray[i * 3 + 1] = particle.position.y
          trailPosArray[i * 3 + 2] = particle.position.z

          // Color fades from bright cyan to purple
          trailColArray[i * 3] = 0.2 + lifeRatio * 0.3
          trailColArray[i * 3 + 1] = 0.6 * lifeRatio + 0.2
          trailColArray[i * 3 + 2] = 1.0

          trailSizeArray[i] = lifeRatio * 1.5

          trailGlowPosArray[i * 3] = particle.position.x
          trailGlowPosArray[i * 3 + 1] = particle.position.y
          trailGlowPosArray[i * 3 + 2] = particle.position.z

          trailGlowColArray[i * 3] = 0.2 + lifeRatio * 0.3
          trailGlowColArray[i * 3 + 1] = 0.6 * lifeRatio + 0.2
          trailGlowColArray[i * 3 + 2] = 1.0
        } else {
          // Hide unused particles
          trailPosArray[i * 3] = 0
          trailPosArray[i * 3 + 1] = 0
          trailPosArray[i * 3 + 2] = -1000
          trailSizeArray[i] = 0
        }
      }

      // Remove dead particles
      for (let i = trailParticles.length - 1; i >= 0; i--) {
        if (trailParticles[i].life <= 0) {
          trailParticles.splice(i, 1)
        }
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

      lineGeometry.setAttribute('position', new THREE.Float32BufferAttribute(linePositions, 3))

      neuronGeometry.attributes.position.needsUpdate = true
      glowGeometry.attributes.position.needsUpdate = true
      trailGeometry.attributes.position.needsUpdate = true
      trailGeometry.attributes.color.needsUpdate = true
      trailGeometry.attributes.size.needsUpdate = true
      trailGlowGeometry.attributes.position.needsUpdate = true
      trailGlowGeometry.attributes.color.needsUpdate = true

      // Gentle rotation
      scene.rotation.y = time * 0.06
      scene.rotation.x = Math.sin(time * 0.1) * 0.05

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
