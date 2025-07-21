"use client"

import { useState, useEffect, useRef } from "react"

export default function ReservationsChart() {
  const canvasRef = useRef(null)
  const tooltipRef = useRef(null)
  const [period, setPeriod] = useState("30d")
  const [hoveredPoint, setHoveredPoint] = useState(null)
  const [chartData, setChartData] = useState([])
  const [chartStats, setChartStats] = useState({})

  // Gerar dados simulados baseados no período
  const generateData = (days) => {
    const data = []
    const now = new Date()

    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(now)
      date.setDate(date.getDate() - i)

      // Simular padrões realistas de reservas
      const dayOfWeek = date.getDay()
      const isWeekend = dayOfWeek === 0 || dayOfWeek === 6
      const isHoliday = Math.random() < 0.05 // 5% chance de ser feriado

      let baseReservations = 45 // Base de reservas por dia

      // Mais reservas nos fins de semana
      if (isWeekend) baseReservations *= 1.4

      // Menos reservas em feriados
      if (isHoliday) baseReservations *= 0.6

      // Adicionar variação aleatória
      const variation = (Math.random() - 0.5) * 20
      const reservations = Math.max(0, Math.round(baseReservations + variation))

      data.push({
        date: date,
        reservations: reservations,
        isWeekend: isWeekend,
        isHoliday: isHoliday,
      })
    }

    return data
  }

  // Calcular estatísticas
  const calculateStats = (data) => {
    if (data.length === 0) return {}

    const total = data.reduce((sum, item) => sum + item.reservations, 0)
    const average = Math.round(total / data.length)
    const max = Math.max(...data.map((item) => item.reservations))
    const min = Math.min(...data.map((item) => item.reservations))

    // Calcular crescimento (comparar primeira e segunda metade)
    const firstHalf = data.slice(0, Math.floor(data.length / 2))
    const secondHalf = data.slice(Math.floor(data.length / 2))

    const firstAvg = firstHalf.reduce((sum, item) => sum + item.reservations, 0) / firstHalf.length
    const secondAvg = secondHalf.reduce((sum, item) => sum + item.reservations, 0) / secondHalf.length

    const growth = (((secondAvg - firstAvg) / firstAvg) * 100).toFixed(1)

    return {
      total,
      average,
      max,
      min,
      growth: Number.parseFloat(growth),
    }
  }

  // Atualizar dados quando o período mudar
  useEffect(() => {
    const days = period === "7d" ? 7 : period === "30d" ? 30 : 90
    const data = generateData(days)
    setChartData(data)
    setChartStats(calculateStats(data))
  }, [period])

  // Desenhar o gráfico
  useEffect(() => {
    if (!canvasRef.current || chartData.length === 0) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    const rect = canvas.getBoundingClientRect()

    // Configurar canvas para alta resolução
    const dpr = window.devicePixelRatio || 1
    canvas.width = rect.width * dpr
    canvas.height = rect.height * dpr
    ctx.scale(dpr, dpr)

    // Limpar canvas
    ctx.clearRect(0, 0, rect.width, rect.height)

    // Configurações do gráfico
    const padding = { top: 20, right: 20, bottom: 40, left: 50 }
    const chartWidth = rect.width - padding.left - padding.right
    const chartHeight = rect.height - padding.top - padding.bottom

    const maxValue = Math.max(...chartData.map((d) => d.reservations))
    const minValue = Math.min(...chartData.map((d) => d.reservations))
    const valueRange = maxValue - minValue || 1

    // Detectar tema atual
    const isDark = document.documentElement.getAttribute("data-theme") === "dark"
    const colors = {
      grid: isDark ? "#334155" : "#f1f5f9",
      text: isDark ? "#cbd5e1" : "#64748b",
      line: "#3b82f6",
      fill: isDark ? "rgba(59, 130, 246, 0.1)" : "rgba(59, 130, 246, 0.05)",
      point: "#3b82f6",
      pointHover: "#1d4ed8",
    }

    // Desenhar grid
    ctx.strokeStyle = colors.grid
    ctx.lineWidth = 1

    // Grid horizontal
    for (let i = 0; i <= 5; i++) {
      const y = padding.top + (chartHeight / 5) * i
      ctx.beginPath()
      ctx.moveTo(padding.left, y)
      ctx.lineTo(padding.left + chartWidth, y)
      ctx.stroke()
    }

    // Grid vertical
    const verticalLines = Math.min(chartData.length, 10)
    for (let i = 0; i <= verticalLines; i++) {
      const x = padding.left + (chartWidth / verticalLines) * i
      ctx.beginPath()
      ctx.moveTo(x, padding.top)
      ctx.lineTo(x, padding.top + chartHeight)
      ctx.stroke()
    }

    // Desenhar labels do eixo Y
    ctx.fillStyle = colors.text
    ctx.font = "12px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
    ctx.textAlign = "right"
    ctx.textBaseline = "middle"

    for (let i = 0; i <= 5; i++) {
      const value = maxValue - (valueRange / 5) * i
      const y = padding.top + (chartHeight / 5) * i
      ctx.fillText(Math.round(value).toString(), padding.left - 10, y)
    }

    // Desenhar labels do eixo X
    ctx.textAlign = "center"
    ctx.textBaseline = "top"

    const labelStep = Math.ceil(chartData.length / 6)
    chartData.forEach((item, index) => {
      if (index % labelStep === 0 || index === chartData.length - 1) {
        const x = padding.left + (chartWidth / (chartData.length - 1)) * index
        const label = item.date.toLocaleDateString("pt-BR", {
          month: "short",
          day: "numeric",
        })
        ctx.fillText(label, x, padding.top + chartHeight + 10)
      }
    })

    // Preparar pontos da linha
    const points = chartData.map((item, index) => ({
      x: padding.left + (chartWidth / (chartData.length - 1)) * index,
      y: padding.top + chartHeight - ((item.reservations - minValue) / valueRange) * chartHeight,
      data: item,
      index,
    }))

    // Desenhar área preenchida
    if (points.length > 1) {
      ctx.fillStyle = colors.fill
      ctx.beginPath()
      ctx.moveTo(points[0].x, padding.top + chartHeight)
      points.forEach((point) => {
        ctx.lineTo(point.x, point.y)
      })
      ctx.lineTo(points[points.length - 1].x, padding.top + chartHeight)
      ctx.closePath()
      ctx.fill()
    }

    // Desenhar linha
    if (points.length > 1) {
      ctx.strokeStyle = colors.line
      ctx.lineWidth = 2
      ctx.beginPath()
      ctx.moveTo(points[0].x, points[0].y)
      points.forEach((point) => {
        ctx.lineTo(point.x, point.y)
      })
      ctx.stroke()
    }

    // Desenhar pontos
    points.forEach((point, index) => {
      const isHovered = hoveredPoint === index
      ctx.fillStyle = isHovered ? colors.pointHover : colors.point
      ctx.beginPath()
      ctx.arc(point.x, point.y, isHovered ? 5 : 3, 0, Math.PI * 2)
      ctx.fill()

      // Destacar fins de semana
      if (point.data.isWeekend) {
        ctx.strokeStyle = colors.line
        ctx.lineWidth = 2
        ctx.beginPath()
        ctx.arc(point.x, point.y, 6, 0, Math.PI * 2)
        ctx.stroke()
      }
    })

    // Salvar pontos para interação
    canvas.chartPoints = points
  }, [chartData, hoveredPoint])

  // Manipular mouse
  const handleMouseMove = (event) => {
    if (!canvasRef.current?.chartPoints) return

    const canvas = canvasRef.current
    const rect = canvas.getBoundingClientRect()
    const x = event.clientX - rect.left
    const y = event.clientY - rect.top

    // Encontrar ponto mais próximo
    let closestPoint = null
    let minDistance = Number.POSITIVE_INFINITY

    canvas.chartPoints.forEach((point, index) => {
      const distance = Math.sqrt(Math.pow(x - point.x, 2) + Math.pow(y - point.y, 2))
      if (distance < 15 && distance < minDistance) {
        minDistance = distance
        closestPoint = index
      }
    })

    setHoveredPoint(closestPoint)

    // Mostrar tooltip
    if (closestPoint !== null && tooltipRef.current) {
      const point = canvas.chartPoints[closestPoint]
      const tooltip = tooltipRef.current

      tooltip.style.left = `${event.clientX + 10}px`
      tooltip.style.top = `${event.clientY - 10}px`
      tooltip.classList.add("visible")

      const date = point.data.date.toLocaleDateString("pt-BR", {
        weekday: "short",
        month: "short",
        day: "numeric",
      })

      tooltip.innerHTML = `
        <div><strong>${date}</strong></div>
        <div>${point.data.reservations} reservas</div>
        ${point.data.isWeekend ? "<div>📅 Fim de semana</div>" : ""}
        ${point.data.isHoliday ? "<div>🎉 Feriado</div>" : ""}
      `
    } else if (tooltipRef.current) {
      tooltipRef.current.classList.remove("visible")
    }
  }

  const handleMouseLeave = () => {
    setHoveredPoint(null)
    if (tooltipRef.current) {
      tooltipRef.current.classList.remove("visible")
    }
  }

  const formatNumber = (num) => {
    return new Intl.NumberFormat("pt-BR").format(num)
  }

  return (
    <div className="chart-container">
      <div className="chart-header">
        <h2 className="chart-title">Reservas por Período</h2>
        <p className="chart-subtitle">Evolução das reservas ao longo do tempo</p>
      </div>

      <div className="chart-controls">
        <button className={`chart-period-btn ${period === "7d" ? "active" : ""}`} onClick={() => setPeriod("7d")}>
          7 dias
        </button>
        <button className={`chart-period-btn ${period === "30d" ? "active" : ""}`} onClick={() => setPeriod("30d")}>
          30 dias
        </button>
        <button className={`chart-period-btn ${period === "90d" ? "active" : ""}`} onClick={() => setPeriod("90d")}>
          90 dias
        </button>
      </div>

      <div className="chart-stats">
        <div className="chart-stat">
          <span className="chart-stat-label">Total</span>
          <span className="chart-stat-value">{formatNumber(chartStats.total || 0)}</span>
        </div>
        <div className="chart-stat">
          <span className="chart-stat-label">Média/dia</span>
          <span className="chart-stat-value">{formatNumber(chartStats.average || 0)}</span>
        </div>
        <div className="chart-stat">
          <span className="chart-stat-label">Máximo</span>
          <span className="chart-stat-value">{formatNumber(chartStats.max || 0)}</span>
        </div>
        <div className="chart-stat">
          <span className="chart-stat-label">Crescimento</span>
          <span
            className="chart-stat-value"
            style={{
              color: (chartStats.growth || 0) >= 0 ? "var(--accent-green)" : "var(--accent-red)",
            }}
          >
            {(chartStats.growth || 0) >= 0 ? "+" : ""}
            {chartStats.growth || 0}%
          </span>
        </div>
      </div>

      <canvas ref={canvasRef} className="chart-canvas" onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave} />

      <div ref={tooltipRef} className="chart-tooltip"></div>
    </div>
  )
}
