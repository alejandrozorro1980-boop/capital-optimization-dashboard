'use client'

import { useState } from 'react'

interface Task {
  id: string
  title: string
  duration: string
  owner: string
  priority: 'high' | 'medium' | 'low'
}

interface Phase {
  id: string
  name: string
  timeline: string
  budget: string
  status: 'pending' | 'in_progress' | 'completed'
  tasks: Task[]
}

const initialData: Phase[] = [
  {
    id: '1',
    name: 'Discovery & Assessment',
    timeline: 'Semana 1-2',
    budget: '€15,000',
    status: 'in_progress',
    tasks: [
      { id: '1-1', title: 'Entrevistas con stakeholders clave', duration: '3 días', owner: 'Equipo Senior', priority: 'high' },
      { id: '1-2', title: 'Análisis de estructura de capital actual', duration: '4 días', owner: 'Analista', priority: 'high' },
    ],
  },
  {
    id: '2',
    name: 'Analysis & Modeling',
    timeline: 'Semana 3-6',
    budget: '€25,000',
    status: 'pending',
    tasks: [
      { id: '2-1', title: 'Modelado de escenarios de optimización', duration: '2 semanas', owner: 'Equipo de Modelos', priority: 'high' },
      { id: '2-2', title: 'Comparativa con benchmarks internacionales', duration: '1 semana', owner: 'Investigación', priority: 'medium' },
    ],
  },
  {
    id: '3',
    name: 'Implementation Planning',
    timeline: 'Semana 7-10',
    budget: '€20,000',
    status: 'pending',
    tasks: [
      { id: '3-1', title: 'Roadmap de implementación', duration: '1 semana', owner: 'Project Manager', priority: 'high' },
    ],
  },
  {
    id: '4',
    name: 'Execution & Monitoring',
    timeline: 'Semana 11-16',
    budget: '€30,000',
    status: 'pending',
    tasks: [
      { id: '4-1', title: 'Ejecución de medidas', duration: '6 semanas', owner: 'Equipo Operativo', priority: 'high' },
    ],
  },
]

export default function Dashboard() {
  const [phases, setPhases] = useState<Phase[]>(initialData)
  const [editingCell, setEditingCell] = useState<string | null>(null)

  const handleCellEdit = (phaseId: string, taskId: string | null, field: string, value: string) => {
    setPhases(phases.map(phase => {
      if (phase.id !== phaseId) return phase
      
      if (taskId) {
        return {
          ...phase,
          tasks: phase.tasks.map(task =>
            task.id === taskId ? { ...task, [field]: value } : task
          )
        }
      } else {
        return { ...phase, [field]: value }
      }
    }))
  }

  const addPhase = () => {
    const newPhase: Phase = {
      id: Date.now().toString(),
      name: 'Nueva Fase',
      timeline: 'TBD',
      budget: '€0',
      status: 'pending',
      tasks: []
    }
    setPhases([...phases, newPhase])
  }

  const addTask = (phaseId: string) => {
    setPhases(phases.map(phase => {
      if (phase.id !== phaseId) return phase
      return {
        ...phase,
        tasks: [...phase.tasks, {
          id: `${phaseId}-${Date.now()}`,
          title: 'Nueva tarea',
          duration: '',
          owner: '',
          priority: 'medium'
        }]
      }
    }))
  }

  const deleteTask = (phaseId: string, taskId: string) => {
    setPhases(phases.map(phase => {
      if (phase.id !== phaseId) return phase
      return {
        ...phase,
        tasks: phase.tasks.filter(t => t.id !== taskId)
      }
    }))
  }

  const deletePhase = (phaseId: string) => {
    setPhases(phases.filter(p => p.id !== phaseId))
  }

  const movePhase = (phaseId: string, direction: 'up' | 'down') => {
    const index = phases.findIndex(p => p.id === phaseId)
    if (index === -1) return
    if (direction === 'up' && index === 0) return
    if (direction === 'down' && index === phases.length - 1) return

    const newPhases = [...phases]
    const targetIndex = direction === 'up' ? index - 1 : index + 1
    ;[newPhases[index], newPhases[targetIndex]] = [newPhases[targetIndex], newPhases[index]]
    setPhases(newPhases)
  }

  const exportJSON = () => {
    const dataStr = JSON.stringify(phases, null, 2)
    const blob = new Blob([dataStr], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `workplan-${new Date().toISOString().split('T')[0]}.json`
    link.click()
  }

  const priorityColors = {
    high: 'bg-red-50 border-red-400',
    medium: 'bg-yellow-50 border-yellow-400',
    low: 'bg-green-50 border-green-400'
  }

  const statusColors = {
    pending: 'bg-gray-100',
    in_progress: 'bg-blue-100',
    completed: 'bg-green-100'
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            Plan de Optimización de Capital
          </h1>
          <p className="text-gray-600">Banco Internacional | Dashboard Ejecutivo</p>
        </div>

        <div className="flex gap-4 mb-6 justify-center">
          <button
            onClick={addPhase}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold shadow-lg transition"
          >
            ➕ Nueva Fase
          </button>
          <button
            onClick={exportJSON}
            className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 font-semibold shadow-lg transition"
          >
            💾 Exportar JSON
          </button>
        </div>

        <div className="space-y-6">
          {phases.map((phase, phaseIndex) => (
            <div key={phase.id} className={`bg-white rounded-lg shadow-lg overflow-hidden border-l-4 border-indigo-600`}>
              <div className={`p-4 ${statusColors[phase.status]}`}>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <input
                      type="text"
                      value={phase.name}
                      onChange={(e) => handleCellEdit(phase.id, null, 'name', e.target.value)}
                      className="text-2xl font-bold bg-transparent border-b-2 border-transparent hover:border-gray-300 focus:border-blue-500 focus:outline-none w-full mb-2"
                    />
                    <div className="flex gap-4 text-sm">
                      <input
                        type="text"
                        value={phase.timeline}
                        onChange={(e) => handleCellEdit(phase.id, null, 'timeline', e.target.value)}
                        className="bg-transparent border-b border-transparent hover:border-gray-300 focus:border-blue-500 focus:outline-none"
                        placeholder="Timeline"
                      />
                      <input
                        type="text"
                        value={phase.budget}
                        onChange={(e) => handleCellEdit(phase.id, null, 'budget', e.target.value)}
                        className="bg-transparent border-b border-transparent hover:border-gray-300 focus:border-blue-500 focus:outline-none font-semibold"
                        placeholder="Budget"
                      />
                      <select
                        value={phase.status}
                        onChange={(e) => handleCellEdit(phase.id, null, 'status', e.target.value)}
                        className="bg-transparent border-b border-gray-300 focus:border-blue-500 focus:outline-none text-sm"
                      >
                        <option value="pending">⏳ Pendiente</option>
                        <option value="in_progress">⚙️ En Progreso</option>
                        <option value="completed">✅ Completado</option>
                      </select>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => movePhase(phase.id, 'up')}
                      disabled={phaseIndex === 0}
                      className="p-2 text-gray-600 hover:bg-white/50 rounded disabled:opacity-30"
                    >
                      ⬆️
                    </button>
                    <button
                      onClick={() => movePhase(phase.id, 'down')}
                      disabled={phaseIndex === phases.length - 1}
                      className="p-2 text-gray-600 hover:bg-white/50 rounded disabled:opacity-30"
                    >
                      ⬇️
                    </button>
                    <button
                      onClick={() => deletePhase(phase.id)}
                      className="p-2 text-red-600 hover:bg-red-100 rounded"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              </div>

              <div className="p-4 space-y-3">
                {phase.tasks.map(task => (
                  <div key={task.id} className={`p-4 rounded-lg border-l-4 ${priorityColors[task.priority]} flex items-start gap-3`}>
                    <div className="flex-1 space-y-2">
                      <input
                        type="text"
                        value={task.title}
                        onChange={(e) => handleCellEdit(phase.id, task.id, 'title', e.target.value)}
                        className="w-full font-semibold bg-transparent border-b border-transparent hover:border-gray-300 focus:border-blue-500 focus:outline-none"
                      />
                      <div className="flex gap-3 text-sm">
                        <input
                          type="text"
                          value={task.duration}
                          onChange={(e) => handleCellEdit(phase.id, task.id, 'duration', e.target.value)}
                          placeholder="Duración"
                          className="bg-transparent border-b border-transparent hover:border-gray-300 focus:border-blue-500 focus:outline-none"
                        />
                        <input
                          type="text"
                          value={task.owner}
                          onChange={(e) => handleCellEdit(phase.id, task.id, 'owner', e.target.value)}
                          placeholder="Responsable"
                          className="bg-transparent border-b border-transparent hover:border-gray-300 focus:border-blue-500 focus:outline-none"
                        />
                        <select
                          value={task.priority}
                          onChange={(e) => handleCellEdit(phase.id, task.id, 'priority', e.target.value as any)}
                          className="bg-transparent border-b border-gray-300 focus:border-blue-500 focus:outline-none"
                        >
                          <option value="high">🔴 Alta</option>
                          <option value="medium">🟡 Media</option>
                          <option value="low">🟢 Baja</option>
                        </select>
                      </div>
                    </div>
                    <button
                      onClick={() => deleteTask(phase.id, task.id)}
                      className="p-2 text-red-600 hover:bg-red-100 rounded"
                    >
                      🗑️
                    </button>
                  </div>
                ))}

                <button
                  onClick={() => addTask(phase.id)}
                  className="w-full py-3 px-4 border-2 border-dashed border-blue-300 rounded-lg text-blue-600 hover:bg-blue-50 font-semibold transition"
                >
                  ➕ Agregar Tarea
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center text-gray-600">
          <p className="text-sm">✏️ Click para editar | ⬆️⬇️ Reordenar fases | 💾 Exportar para guardar</p>
          <p className="text-xs mt-2 text-gray-500">Dashboard flexible para consultoría bancaria | Made with 🦊</p>
        </div>
      </div>
    </div>
  )
}
