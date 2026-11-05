<template>
  <div class="dashboard-root" dir="rtl">
    <!-- Loading State -->
    <div v-if="initialLoading" class="loading-screen">
      <div class="loading-orb">
        <div class="orb-ring ring-1"></div>
        <div class="orb-ring ring-2"></div>
        <div class="orb-ring ring-3"></div>
        <svg
          class="orb-icon"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="1.5"
        >
          <path
            d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75z"
          />
          <path
            d="M9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625z"
          />
          <path
            d="M16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z"
          />
        </svg>
      </div>
      <p class="loading-text">{{ $t('dashboard.loading_data') }}</p>
      <p class="loading-sub">{{ $t('dashboard.preparing_insights') }}</p>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="error-screen">
      <div class="error-card">
        <div class="error-icon-wrap">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <path
              d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126z"
            />
            <path d="M12 15.75h.007v.008H12v-.008z" />
          </svg>
        </div>
        <h3>{{ $t('common.error') }}</h3>
        <p>{{ error }}</p>
        <div class="error-actions">
          <button class="btn-primary" @click="loadDashboardData">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path
                d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99"
              />
            </svg>
            {{ $t('common.retry') }}
          </button>
          <button class="btn-ghost" @click="goToHome">{{ $t('common.go_home') }}</button>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <div v-else class="dashboard-content">
      <!-- Fallback Data Warning -->
      <div v-if="isFallback" class="fallback-banner">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path
            d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126z"
          />
          <path d="M12 15.75h.007v.008H12v-.008z" />
        </svg>
        <span>{{ $t('dashboard.fallback_warning') }}</span>
      </div>

      <!-- Hero Header -->
      <header class="hero-header">
        <div class="hero-bg">
          <div class="hero-mesh mesh-1"></div>
          <div class="hero-mesh mesh-2"></div>
          <div class="hero-mesh mesh-3"></div>
        </div>
        <div class="hero-inner">
          <div class="hero-greeting">
            <div class="hero-badge" :class="{ 'hero-badge--warning': isFallback }">
              <span class="badge-dot"></span>
              <span>{{ isFallback ? $t('dashboard.data_unavailable') : $t('common.live') }}</span>
            </div>
            <h1 class="hero-title">
              {{ $t('dashboard.welcome_back') }}،
              <span class="hero-name">{{ user?.name || $t('common.user') }}</span>
            </h1>
            <p class="hero-subtitle">
              {{ $t('dashboard.overview_subtitle') }}
              <span v-if="isAdmin" class="admin-chip">{{ $t('auth.admin_indicator') }}</span>
            </p>
          </div>
          <div class="hero-perf">
            <div class="perf-label">{{ $t('dashboard.today_performance') }}</div>
            <div class="perf-value">
              <span class="perf-num">{{ todayPerformance }}<span class="perf-unit">%</span></span>
            </div>
            <div class="perf-bar">
              <div class="perf-fill" :style="{ width: todayPerformance + '%' }"></div>
            </div>
            <div class="perf-sub">{{ $t('dashboard.last_updated') }}: {{ lastUpdated }}</div>
          </div>
        </div>
      </header>

      <!-- KPI Cards -->
      <section class="kpi-grid">
        <!-- Revenue -->
        <div
          class="kpi-card kpi-green"
          @mouseenter="hoveredCard = 'revenue'"
          @mouseleave="hoveredCard = null"
        >
          <div class="kpi-glow"></div>
          <div class="kpi-top">
            <div class="kpi-icon-wrap">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                <path
                  d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33"
                />
              </svg>
            </div>
            <div class="kpi-trend" :class="revenueGrowth >= 0 ? 'trend-up' : 'trend-down'">
              <svg viewBox="0 0 16 16" fill="currentColor">
                <path v-if="revenueGrowth >= 0" d="M8 4l4 4H4z" />
                <path v-else d="M8 12L4 8h8z" />
              </svg>
              {{ Math.abs(revenueGrowth) }}%
            </div>
          </div>
          <div class="kpi-value">{{ formatCurrency(totalRevenue) }}</div>
          <div class="kpi-label">{{ $t('dashboard.total_revenue') }}</div>
          <div class="kpi-footer">
            <span class="kpi-period">{{ $t('common.from_last_month') }}</span>
            <button
              v-if="hasPermission('view_sales_report')"
              class="kpi-action"
              @click="viewRevenueDetails"
            >
              التفاصيل
              <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M3 8h10M9 4l4 4-4 4" />
              </svg>
            </button>
          </div>
          <div class="kpi-bar-track">
            <div
              class="kpi-bar-fill"
              :style="{ width: Math.min(Math.abs(revenueGrowth) * 3, 100) + '%' }"
            ></div>
          </div>
        </div>

        <!-- Invoices -->
        <div
          class="kpi-card kpi-blue"
          @mouseenter="hoveredCard = 'invoices'"
          @mouseleave="hoveredCard = null"
        >
          <div class="kpi-glow"></div>
          <div class="kpi-top">
            <div class="kpi-icon-wrap">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                <path
                  d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25z"
                />
              </svg>
            </div>
            <div class="kpi-trend" :class="invoiceGrowth >= 0 ? 'trend-up' : 'trend-down'">
              <svg viewBox="0 0 16 16" fill="currentColor">
                <path v-if="invoiceGrowth >= 0" d="M8 4l4 4H4z" />
                <path v-else d="M8 12L4 8h8z" />
              </svg>
              {{ Math.abs(invoiceGrowth) }}%
            </div>
          </div>
          <div class="kpi-value">{{ totalInvoices }}</div>
          <div class="kpi-label">{{ $t('dashboard.total_invoices') }}</div>
          <div class="kpi-footer">
            <span class="kpi-period">{{ $t('common.from_last_month') }}</span>
            <button v-if="hasPermission('view_invoices')" class="kpi-action" @click="viewInvoices">
              عرض الكل
              <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M3 8h10M9 4l4 4-4 4" />
              </svg>
            </button>
          </div>
          <div class="kpi-bar-track">
            <div
              class="kpi-bar-fill"
              :style="{ width: Math.min(Math.abs(invoiceGrowth) * 3, 100) + '%' }"
            ></div>
          </div>
        </div>

        <!-- Clients -->
        <div
          class="kpi-card kpi-purple"
          @mouseenter="hoveredCard = 'clients'"
          @mouseleave="hoveredCard = null"
        >
          <div class="kpi-glow"></div>
          <div class="kpi-top">
            <div class="kpi-icon-wrap">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                <path
                  d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z"
                />
              </svg>
            </div>
            <div class="kpi-trend" :class="clientsGrowth >= 0 ? 'trend-up' : 'trend-down'">
              <svg viewBox="0 0 16 16" fill="currentColor">
                <path v-if="clientsGrowth >= 0" d="M8 4l4 4H4z" />
                <path v-else d="M8 12L4 8h8z" />
              </svg>
              {{ Math.abs(clientsGrowth) }}%
            </div>
          </div>
          <div class="kpi-value">{{ totalClients }}</div>
          <div class="kpi-label">{{ $t('dashboard.total_clients') }}</div>
          <div class="kpi-footer">
            <span class="kpi-period">{{ $t('common.from_last_month') }}</span>
            <button v-if="hasPermission('view_clients')" class="kpi-action" @click="viewClients">
              عرض الكل
              <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M3 8h10M9 4l4 4-4 4" />
              </svg>
            </button>
          </div>
          <div class="kpi-bar-track">
            <div
              class="kpi-bar-fill"
              :style="{ width: Math.min(Math.abs(clientsGrowth) * 3, 100) + '%' }"
            ></div>
          </div>
        </div>

        <!-- Payment Rate -->
        <div
          class="kpi-card kpi-amber"
          @mouseenter="hoveredCard = 'payment'"
          @mouseleave="hoveredCard = null"
        >
          <div class="kpi-glow"></div>
          <div class="kpi-top">
            <div class="kpi-icon-wrap">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                <path
                  d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z"
                />
              </svg>
            </div>
            <div class="kpi-radial">
              <svg viewBox="0 0 36 36" class="radial-svg">
                <circle cx="18" cy="18" r="15" fill="none" stroke-width="3" class="radial-bg" />
                <circle
                  cx="18"
                  cy="18"
                  r="15"
                  fill="none"
                  stroke-width="3"
                  class="radial-fill"
                  :stroke-dasharray="`${paymentRate * 0.942} 94.2`"
                  stroke-dashoffset="23.55"
                />
              </svg>
            </div>
          </div>
          <div class="kpi-value">{{ paymentRate }}<span class="kpi-unit">%</span></div>
          <div class="kpi-label">{{ $t('invoices.payment_rate') }}</div>
          <div class="kpi-progress-wrap">
            <div class="kpi-progress-track">
              <div class="kpi-progress-fill" :style="{ width: paymentRate + '%' }"></div>
            </div>
            <span class="kpi-progress-label">{{ collectionRate }}% محصّل</span>
          </div>
          <div class="kpi-bar-track">
            <div class="kpi-bar-fill" :style="{ width: paymentRate + '%' }"></div>
          </div>
        </div>
      </section>

      <!-- Charts Row -->
      <section class="charts-row">
        <!-- Revenue Chart -->
        <div v-if="hasPermission('view_sales_report')" class="chart-card chart-main">
          <div class="chart-header">
            <div>
              <h3 class="chart-title">{{ $t('dashboard.revenue_trend') }}</h3>
              <p class="chart-sub">{{ $t('dashboard.revenue_insights') }}</p>
            </div>
            <div class="period-tabs">
              <button
                v-for="p in chartPeriods"
                :key="p.value"
                class="period-btn"
                :class="{ active: revenuePeriod === p.value }"
                @click="changeChartPeriod('revenue', p.value)"
              >
                {{ p.label }}
              </button>
            </div>
          </div>
          <div class="chart-body">
            <div class="h-80">
              <LineChart
                :chartData="revenueChartData"
                :options="enhancedLineChartOptions"
                :key="'revenue-' + revenuePeriod"
              />
            </div>
          </div>
          <div class="chart-footer-stats">
            <div class="chart-stat">
              <span class="chart-stat-label">متوسط شهري</span>
              <span class="chart-stat-val">{{ formatCurrency(avgMonthlyRevenue) }}</span>
            </div>
            <div class="chart-stat-divider"></div>
            <div class="chart-stat">
              <span class="chart-stat-label">معدل النمو</span>
              <span class="chart-stat-val green">{{ revenueGrowth }}%</span>
            </div>
          </div>
        </div>

        <!-- Invoice Status Donut -->
        <div v-if="hasPermission('view_invoices')" class="chart-card chart-side">
          <div class="chart-header">
            <div>
              <h3 class="chart-title">{{ $t('invoices.status_distribution') }}</h3>
              <p class="chart-sub">{{ $t('dashboard.status_overview') }}</p>
            </div>
            <button @click="viewAllInvoices" class="view-link">
              عرض التفاصيل
              <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M3 8h10M9 4l4 4-4 4" />
              </svg>
            </button>
          </div>
          <div class="chart-body">
            <div class="donut-wrap">
              <DoughnutChart
                :chartData="invoiceStatusChartData"
                :options="enhancedDoughnutChartOptions"
              />
            </div>
            <div class="status-list">
              <div
                v-for="s in invoiceStatuses"
                :key="s.status"
                class="status-item"
                @click="filterByStatus(s.status)"
              >
                <div class="status-dot" :style="{ background: s.color }"></div>
                <div class="status-info">
                  <span class="status-name">{{ s.label }}</span>
                  <span class="status-amount">{{ formatCurrency(s.amount) }}</span>
                </div>
                <div class="status-nums">
                  <span class="status-count">{{ s.value }}</span>
                  <span class="status-pct" :style="{ color: s.color }">{{ s.percentage }}%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Bottom Row -->
      <section class="bottom-row">
        <!-- Left: Performance + Activity -->
        <div class="bottom-main">
          <!-- Performance Chart -->
          <div class="chart-card">
            <div class="chart-header">
              <div>
                <h3 class="chart-title">{{ $t('dashboard.monthly_performance') }}</h3>
                <p class="chart-sub">{{ $t('dashboard.invoices_vs_revenue') }}</p>
              </div>
              <div class="legend-row">
                <span class="legend-item blue">{{ $t('dashboard.invoices') }}</span>
                <span class="legend-item green">{{ $t('dashboard.revenue') }}</span>
              </div>
            </div>
            <div class="chart-body">
              <div class="h-72">
                <BarChart :chartData="performanceChartData" :options="performanceChartOptions" />
              </div>
            </div>
          </div>

          <!-- Activity Feed -->
          <div class="chart-card">
            <div class="chart-header">
              <h3 class="chart-title">{{ $t('dashboard.recent_activity') }}</h3>
              <div class="header-actions">
                <button class="icon-btn" @click="loadDashboardData" title="تحديث">
                  <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="2">
                    <path
                      d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99"
                    />
                  </svg>
                </button>
                <button v-if="isAdmin" class="text-btn" @click="viewAllActivity">عرض الكل</button>
              </div>
            </div>
            <div class="activity-list">
              <div
                v-for="act in recentActivity"
                :key="act.id"
                class="activity-item"
                @click="handleActivityClick(act)"
              >
                <div class="act-icon" :class="getActivityIconClass(act.type)">
                  <i :class="['fas', getActivityIcon(act.type)]"></i>
                </div>
                <div class="act-body">
                  <p class="act-title">{{ act.title }}</p>
                  <p class="act-desc">{{ act.description }}</p>
                  <p class="act-time">{{ formatTimeAgo(act.timestamp) }}</p>
                </div>
                <div class="act-right">
                  <span v-if="act.amount" class="act-amount">{{ formatCurrency(act.amount) }}</span>
                  <svg
                    class="act-arrow"
                    viewBox="0 0 16 16"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                  >
                    <path d="M3 8h10M9 4l4 4-4 4" />
                  </svg>
                </div>
              </div>
              <div v-if="recentActivity.length === 0" class="empty-state">
                <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="1">
                  <circle cx="24" cy="24" r="20" />
                  <path d="M24 14v10l6 6" />
                </svg>
                <p>{{ $t('dashboard.no_recent_activity') }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Right: Quick Actions + Top Clients -->
        <div class="bottom-side">
          <!-- Quick Actions -->
          <div class="chart-card">
            <div class="chart-header">
              <h3 class="chart-title">
                <svg class="title-icon amber" viewBox="0 0 20 20" fill="currentColor">
                  <path
                    d="M11.983 1.907a.75.75 0 00-1.292-.657l-8.5 9.5A.75.75 0 002.75 12h6.572l-1.305 6.093a.75.75 0 001.292.657l8.5-9.5A.75.75 0 0017.25 8h-6.572l1.305-6.093z"
                  />
                </svg>
                {{ $t('buttons.quick_actions') }}
              </h3>
            </div>
            <div class="quick-actions">
              <router-link
                v-if="hasPermission('create_invoice')"
                to="/invoices/create"
                class="qa-item qa-blue"
              >
                <div class="qa-icon">
                  <svg viewBox="0 0 20 20" fill="currentColor">
                    <path
                      d="M10.75 4.75a.75.75 0 00-1.5 0v4.5h-4.5a.75.75 0 000 1.5h4.5v4.5a.75.75 0 001.5 0v-4.5h4.5a.75.75 0 000-1.5h-4.5v-4.5z"
                    />
                  </svg>
                </div>
                <div class="qa-text">
                  <span class="qa-title">{{ $t('invoices.create_invoice') }}</span>
                  <span class="qa-desc">{{ $t('invoices.quick_create') }}</span>
                </div>
                <svg
                  class="qa-arrow"
                  viewBox="0 0 16 16"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                >
                  <path d="M3 8h10M9 4l4 4-4 4" />
                </svg>
              </router-link>

              <router-link
                v-if="hasPermission('create_client')"
                to="/clients/create"
                class="qa-item qa-green"
              >
                <div class="qa-icon">
                  <svg viewBox="0 0 20 20" fill="currentColor">
                    <path
                      d="M11 5a3 3 0 11-6 0 3 3 0 016 0zM2.615 16.428a1.224 1.224 0 01-.585-1.303 7.501 7.501 0 0114.94 0 1.224 1.224 0 01-.585 1.303 1.234 1.234 0 01-.68.072 7.5 7.5 0 01-13.09 0 1.234 1.234 0 01-.678-.072l-.322.001zM16.5 6.75a.75.75 0 01.75.75V9h1.5a.75.75 0 010 1.5H17.25v1.5a.75.75 0 01-1.5 0V10.5H14.25a.75.75 0 010-1.5h1.5V7.5a.75.75 0 01.75-.75z"
                    />
                  </svg>
                </div>
                <div class="qa-text">
                  <span class="qa-title">{{ $t('clients.addClient') }}</span>
                  <span class="qa-desc">{{ $t('clients.quick_add') }}</span>
                </div>
                <svg
                  class="qa-arrow"
                  viewBox="0 0 16 16"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                >
                  <path d="M3 8h10M9 4l4 4-4 4" />
                </svg>
              </router-link>

              <router-link
                v-if="hasPermission('view_reports')"
                to="/reports"
                class="qa-item qa-purple"
              >
                <div class="qa-icon">
                  <svg viewBox="0 0 20 20" fill="currentColor">
                    <path
                      d="M15.5 2A1.5 1.5 0 0014 3.5v13a1.5 1.5 0 001.5 1.5h1a1.5 1.5 0 001.5-1.5v-13A1.5 1.5 0 0016.5 2h-1zM9.5 6A1.5 1.5 0 008 7.5v9A1.5 1.5 0 009.5 18h1a1.5 1.5 0 001.5-1.5v-9A1.5 1.5 0 0010.5 6h-1zM3.5 10A1.5 1.5 0 002 11.5v5A1.5 1.5 0 003.5 18h1A1.5 1.5 0 006 16.5v-5A1.5 1.5 0 004.5 10h-1z"
                    />
                  </svg>
                </div>
                <div class="qa-text">
                  <span class="qa-title">{{ $t('reports.title') }}</span>
                  <span class="qa-desc">{{ $t('reports.view_insights') }}</span>
                </div>
                <svg
                  class="qa-arrow"
                  viewBox="0 0 16 16"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                >
                  <path d="M3 8h10M9 4l4 4-4 4" />
                </svg>
              </router-link>
            </div>
          </div>

          <!-- Top Clients -->
          <div v-if="hasPermission('view_clients')" class="chart-card">
            <div class="chart-header">
              <h3 class="chart-title">
                <svg class="title-icon amber" viewBox="0 0 20 20" fill="currentColor">
                  <path
                    fill-rule="evenodd"
                    d="M10 1a.75.75 0 01.673.418l1.882 3.815 4.21.612a.75.75 0 01.416 1.279l-3.046 2.97.719 4.192a.75.75 0 01-1.088.791L10 13.347l-3.766 1.98a.75.75 0 01-1.088-.79l.72-4.194L2.818 7.124a.75.75 0 01.416-1.28l4.21-.611L9.327 1.418A.75.75 0 0110 1z"
                  />
                </svg>
                {{ $t('dashboard.top_clients') }}
              </h3>
              <router-link to="/clients" class="text-btn">{{ $t('common.view_all') }}</router-link>
            </div>
            <div class="clients-list">
              <div
                v-for="(client, idx) in topClients"
                :key="client.id"
                class="client-item"
                @click="goToClient(client.id)"
              >
                <div class="client-rank-wrap">
                  <div class="client-avatar">{{ getInitials(client.name) }}</div>
                  <span v-if="idx < 3" class="client-rank">{{ idx + 1 }}</span>
                </div>
                <div class="client-info">
                  <p class="client-name">{{ client.name }}</p>
                  <p class="client-company">{{ client.company_name || $t('clients.noCompany') }}</p>
                </div>
                <div class="client-stats">
                  <span class="client-spent">{{ formatCurrency(client.total_spent || 0) }}</span>
                  <span class="client-growth" :class="(client.growth || 0) >= 0 ? 'up' : 'down'">
                    {{ (client.growth || 0) >= 0 ? '↑' : '↓' }} {{ Math.abs(client.growth || 0) }}%
                  </span>
                </div>
              </div>
              <div v-if="topClients.length === 0" class="empty-state small">
                <p>{{ $t('clients.no_clients') }}</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script>
import { mapState, mapGetters, mapActions } from 'vuex'
import LineChart from '@/components/charts/LineChart.vue'
import BarChart from '@/components/charts/BarChart.vue'
import DoughnutChart from '@/components/charts/DoughnutChart.vue'

export default {
  name: 'Dashboard',
  components: { LineChart, BarChart, DoughnutChart },

  data() {
    return {
      initialLoading: true,
      revenuePeriod: '6m',
      hoveredCard: null,
      chartPeriods: [
        { label: '1M', value: '1m' },
        { label: '3M', value: '3m' },
        { label: '6M', value: '6m' },
        { label: '1Y', value: '1y' },
      ],
      enhancedLineChartOptions: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: { intersect: false, mode: 'index' },
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: '#fff',
            titleColor: '#0f172a',
            bodyColor: '#475569',
            borderColor: '#e2e8f0',
            borderWidth: 1,
            cornerRadius: 10,
            padding: 12,
            callbacks: {
              label: (ctx) => `${ctx.dataset.label}: ${this.formatCurrency(ctx.raw)}`,
            },
          },
        },
        scales: {
          x: {
            grid: { color: 'rgba(0,0,0,0.04)', drawBorder: false },
            ticks: { color: '#94a3b8', font: { size: 11 } },
          },
          y: {
            grid: { color: 'rgba(0,0,0,0.04)', drawBorder: false },
            ticks: {
              color: '#94a3b8',
              font: { size: 11 },
              callback: (v) => (v >= 1000 ? (v / 1000).toFixed(0) + 'K' : v),
            },
          },
        },
        elements: {
          point: {
            radius: 3,
            hoverRadius: 6,
            backgroundColor: '#fff',
            borderWidth: 2,
            borderColor: '#6366f1',
          },
          line: { tension: 0.4, borderWidth: 2.5 },
        },
      },
      enhancedBarChartOptions: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: '#fff',
            titleColor: '#0f172a',
            bodyColor: '#475569',
            borderColor: '#e2e8f0',
            borderWidth: 1,
            cornerRadius: 10,
            padding: 12,
          },
        },
        scales: {
          x: {
            grid: { display: false, drawBorder: false },
            ticks: { color: '#94a3b8', font: { size: 11 } },
          },
          y: {
            beginAtZero: true,
            grid: { color: 'rgba(0,0,0,0.04)', drawBorder: false },
            ticks: {
              color: '#94a3b8',
              font: { size: 11 },
              callback: (v) => (v >= 1000 ? (v / 1000).toFixed(0) + 'K' : v),
            },
          },
        },
        elements: { bar: { borderRadius: 6, borderSkipped: false } },
      },
      enhancedDoughnutChartOptions: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '72%',
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: '#fff',
            titleColor: '#0f172a',
            bodyColor: '#475569',
            borderColor: '#e2e8f0',
            borderWidth: 1,
            cornerRadius: 10,
            padding: 12,
            callbacks: {
              label: (ctx) => {
                const total = ctx.dataset.data.reduce((a, b) => a + b, 0)
                const pct = total > 0 ? Math.round((ctx.raw / total) * 100) : 0
                return `${ctx.label}: ${ctx.raw} (${pct}%)`
              },
            },
          },
        },
        elements: { arc: { borderWidth: 0 } },
        animation: { animateScale: true, animateRotate: true },
      },
    }
  },

  computed: {
    ...mapState('auth', ['user', 'permissions', 'is_admin']),
    ...mapState('dashboard', ['stats', 'loading', 'error']),
    ...mapGetters('dashboard', [
      'isFallback',
      'recentClients',
      'recentInvoices',
      'formatCurrency',
      'formatDate',
      'getInitials',
    ]),
    ...mapGetters('dashboard', {
      monthlyRevenueData: 'monthlyRevenue',
      activityFeed: 'recentActivity',
      storeLastUpdated: 'lastUpdated',
    }),
    ...mapGetters('auth', ['hasPermission']),

    totalInvoices() {
      return this.stats?.totalInvoices || 0
    },
    paidInvoices() {
      return this.stats?.paidInvoices || 0
    },
    pendingInvoices() {
      return this.stats?.pendingInvoices || 0
    },
    overdueInvoices() {
      return this.stats?.overdueInvoices || 0
    },
    draftInvoices() {
      return this.stats?.draftInvoices || 0
    },
    totalClients() {
      return this.stats?.totalClients || 0
    },
    totalRevenue() {
      return this.stats?.totalRevenue ?? this.stats?.revenue ?? 0
    },
    paidAmount() {
      return this.stats?.paidAmount || 0
    },
    pendingAmount() {
      return this.stats?.pendingAmount || 0
    },
    overdueAmount() {
      return this.stats?.overdueAmount || 0
    },
    draftAmount() {
      return this.stats?.draftAmount || 0
    },
    paymentRate() {
      return this.stats?.paymentRate || 0
    },
    revenueGrowth() {
      return this.stats?.revenueGrowth || 0
    },
    invoiceGrowth() {
      return this.stats?.invoiceGrowth || 0
    },
    clientsGrowth() {
      return this.stats?.clientsGrowth || 0
    },
    avgMonthlyRevenue() {
      return this.stats?.avgMonthlyRevenue || 0
    },
    isAdmin() {
      return this.is_admin || false
    },

    // نسبة التحصيل = المدفوع ÷ (المدفوع + المرسل + المتأخر)، دون المسودات لأنها لم تُصدر بعد
    collectionRate() {
      const paid = Number(this.paidAmount) || 0
      const issued = paid + (Number(this.pendingAmount) || 0) + (Number(this.overdueAmount) || 0)
      return issued > 0 ? Math.round((paid / issued) * 100) : 0
    },

    todayPerformance() {
      const todayPaid = this.stats?.todayPaidInvoices || 0
      const todayTotal = this.stats?.todayTotalInvoices || 0
      return todayTotal > 0 ? Math.min(100, Math.round((todayPaid / todayTotal) * 100)) : 0
    },

    lastUpdated() {
      const at = this.storeLastUpdated ? new Date(this.storeLastUpdated) : new Date()
      return at.toLocaleTimeString(this.$i18n.locale === 'ar' ? 'en-US' : 'en-US', {
        hour: '2-digit',
        minute: '2-digit',
      })
    },

    invoiceStatuses() {
      const statuses = [
        {
          status: 'paid',
          label: this.$t('invoices.statuses.paid'),
          value: this.paidInvoices,
          color: '#10b981',
          amount: this.paidAmount,
        },
        {
          status: 'sent',
          label: this.$t('invoices.statuses.sent'),
          value: this.pendingInvoices,
          color: '#f59e0b',
          amount: this.pendingAmount,
        },
        {
          status: 'overdue',
          label: this.$t('invoices.statuses.overdue'),
          value: this.overdueInvoices,
          color: '#ef4444',
          amount: this.overdueAmount,
        },
        {
          status: 'draft',
          label: this.$t('invoices.statuses.draft'),
          value: this.draftInvoices,
          color: '#8b5cf6',
          amount: this.draftAmount,
        },
      ]
      const total = statuses.reduce((s, x) => s + x.value, 0)
      return statuses.map((s) => ({
        ...s,
        percentage: total > 0 ? Math.round((s.value / total) * 100) : 0,
      }))
    },

    invoiceStatusChartData() {
      return {
        labels: this.invoiceStatuses.map((s) => s.label),
        datasets: [
          {
            data: this.invoiceStatuses.map((s) => s.value),
            backgroundColor: this.invoiceStatuses.map((s) => s.color),
            borderWidth: 0,
            hoverOffset: 12,
          },
        ],
      }
    },

    revenueChartData() {
      const months = { '1m': 1, '3m': 3, '6m': 6, '1y': 12 }[this.revenuePeriod] || 6
      const series = this.monthSeries(months)

      return {
        labels: series.map((item) => item.label),
        datasets: [
          {
            label: this.$t('dashboard.revenue'),
            data: series.map((item) => item.revenue),
            borderColor: '#6366f1',
            backgroundColor: (ctx) => {
              const g = ctx.chart.ctx.createLinearGradient(0, 0, 0, 300)
              g.addColorStop(0, 'rgba(99,102,241,0.15)')
              g.addColorStop(1, 'rgba(99,102,241,0.01)')
              return g
            },
            fill: true,
            tension: 0.4,
            borderWidth: 2.5,
          },
        ],
      }
    },

        performanceChartData() {
      const series = this.monthSeries(6)

      return {
        labels: series.map((item) => item.label),
        datasets: [
          {
            label: this.$t('dashboard.invoices'),
            data: series.map((item) => item.invoices),
            backgroundColor: 'rgba(99,102,241,0.75)',
            yAxisID: 'y',
          },
          {
            label: this.$t('dashboard.revenue'),
            data: series.map((item) => item.revenue),
            backgroundColor: 'rgba(16,185,129,0.75)',
            yAxisID: 'y1',
          },
        ],
      }
    },

    // عدد الفواتير والإيراد بمقياسين مختلفين: محور لكل منهما
    performanceChartOptions() {
      const base = this.enhancedBarChartOptions

      return {
        ...base,
        scales: {
          ...base.scales,
          y1: {
            position: 'right',
            beginAtZero: true,
            grid: { drawOnChartArea: false },
            ticks: {
              color: '#94a3b8',
              font: { size: 11 },
              callback: (v) => (v >= 1000 ? (v / 1000).toFixed(0) + 'K' : v),
            },
          },
        },
      }
    },

        recentActivity() {
      return (this.activityFeed || []).map((item) => ({
        ...item,
        // الباك إند يرسل الوقت بالثواني (UNIX)، فلا يتأثر بفرق المنطقة الزمنية
        timestamp: item.timestamp ? new Date(item.timestamp * 1000) : new Date(String(item.created_at).replace(' ', 'T') + 'Z'),
      }))
    },

        topClients() {
      return (this.recentClients || [])
        .slice(0, 5)
        .map((c) => ({ ...c, total_spent: c.total_spent || 0, growth: c.growth || 0 }))
    },
  },

  async mounted() {
    await this.loadDashboardData()
    this.initialLoading = false
  },

  methods: {
    ...mapActions('dashboard', ['fetchDashboardData', 'refreshDashboardData']),

    async loadDashboardData() {
      try {
        await this.fetchDashboardData()
        this.$toast?.success(this.$t('dashboard.data_loaded'))
      } catch {
        this.$toast?.error(this.$t('dashboard.data_load_error'))
      }
    },

    goToClient(id) {
      if (this.hasPermission('view_clients')) this.$router.push(`/clients/${id}`)
    },
    goToHome() {
      this.$router.push('/')
    },
    changeChartPeriod(type, period) {
      if (type === 'revenue') this.revenuePeriod = period
    },
    viewRevenueDetails() {
      this.$router.push('/reports?type=revenue')
    },
    viewInvoices() {
      this.$router.push('/invoices')
    },
    viewClients() {
      this.$router.push('/clients')
    },
    viewAllInvoices() {
      this.$router.push('/invoices')
    },
    viewAllActivity() {
      this.$router.push('/activitylog')
    },
    filterByStatus(status) {
      this.$router.push({ path: '/invoices', query: { status } })
    },
    handleActivityClick(act) {
      if (act.invoice_id) this.$router.push(`/invoices/${act.invoice_id}`)
      else if (act.clientId) this.$router.push(`/clients/${act.clientId}`)
    },

    monthSeries(count) {
      const locale = this.$i18n.locale === 'ar' ? 'ar' : 'en-US'
      const byMonth = {}
      ;(this.monthlyRevenueData || []).forEach((row) => {
        byMonth[`${row.year}-${row.month_number}`] = row
      })

      // آخر N أشهر (الأحدث أخيراً)، والأشهر بلا مدفوعات تظهر بصفر
      const now = new Date()
      return Array.from({ length: count }, (_, i) => {
        const d = new Date(now.getFullYear(), now.getMonth() - (count - 1 - i), 1)
        const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
        const row = byMonth[key]

        return {
          label: d.toLocaleDateString(locale, count > 6 ? { month: 'short', year: '2-digit' } : { month: 'long' }),
          revenue: row ? Number(row.revenue) || 0 : 0,
          invoices: row ? Number(row.invoice_count) || 0 : 0,
        }
      })
    },

        getActivityIcon(type) {
      return (
        {
          invoice_paid: 'fa-check-circle',
          invoice_created: 'fa-file-invoice',
          client_added: 'fa-user-plus',
          payment_received: 'fa-money-bill-wave',
        }[type] || 'fa-bell'
      )
    },

    getActivityIconClass(type) {
      return (
        {
          invoice_paid: 'act-green',
          invoice_created: 'act-blue',
          client_added: 'act-purple',
          payment_received: 'act-teal',
        }[type] || 'act-gray'
      )
    },

    formatTimeAgo(date) {
      const diff = Date.now() - date
      const m = Math.floor(diff / 60000),
        h = Math.floor(diff / 3600000),
        d = Math.floor(diff / 86400000)
      if (d > 0) return `قبل ${d} يوم`
      if (h > 0) return `قبل ${h} ساعة`
      if (m > 0) return `قبل ${m} دقيقة`
      return 'الآن'
    },
  },
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Cairo:wght@300;400;500;600;700;800&display=swap');

/* ─── Root ─────────────────────────────────────────────────────────────── */
.dashboard-root {
  font-family: 'Cairo', sans-serif;
  background: rgb(var(--color-bg-page));
  min-height: 100vh;
  direction: rtl;
}

/* ─── Loading ───────────────────────────────────────────────────────────── */
.loading-screen {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 80vh;
  gap: 1.5rem;
}

.loading-orb {
  position: relative;
  width: 80px;
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.orb-ring {
  position: absolute;
  border-radius: 50%;
  border: 2px solid transparent;
  animation: spin linear infinite;
}

.ring-1 {
  inset: 0;
  border-top-color: #6366f1;
  animation-duration: 1.2s;
}
.ring-2 {
  inset: 8px;
  border-top-color: #8b5cf6;
  animation-duration: 0.9s;
  animation-direction: reverse;
}
.ring-3 {
  inset: 16px;
  border-top-color: #a78bfa;
  animation-duration: 0.7s;
}

.orb-icon {
  width: 24px;
  height: 24px;
  color: #6366f1;
}

.loading-text {
  font-size: 1rem;
  font-weight: 600;
  color: #334155;
}
.loading-sub {
  font-size: 0.85rem;
  color: #94a3b8;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

/* ─── Error ─────────────────────────────────────────────────────────────── */
.error-screen {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 80vh;
  padding: 2rem;
}

.error-card {
  background: #fff;
  border: 1px solid #fee2e2;
  border-radius: 20px;
  padding: 3rem;
  text-align: center;
  max-width: 440px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}

.error-icon-wrap {
  width: 64px;
  height: 64px;
  background: #fef2f2;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #ef4444;
}
.error-icon-wrap svg {
  width: 28px;
  height: 28px;
}

.error-card h3 {
  font-size: 1.25rem;
  font-weight: 700;
  color: #0f172a;
  margin: 0;
}
.error-card p {
  color: #64748b;
  font-size: 0.9rem;
  margin: 0;
}

.error-actions {
  display: flex;
  gap: 0.75rem;
  margin-top: 0.5rem;
}

.btn-primary {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 0.65rem 1.5rem;
  background: linear-gradient(135deg, #ef4444, #dc2626);
  color: #fff;
  border: none;
  border-radius: 12px;
  font-family: 'Cairo', sans-serif;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition:
    transform 0.2s,
    box-shadow 0.2s;
}
.btn-primary:hover {
  transform: translateY(-1px);
  box-shadow: 0 6px 20px rgba(239, 68, 68, 0.35);
}
.btn-primary svg {
  width: 16px;
  height: 16px;
}

.btn-ghost {
  padding: 0.65rem 1.5rem;
  background: transparent;
  color: #64748b;
  border: 1.5px solid #e2e8f0;
  border-radius: 12px;
  font-family: 'Cairo', sans-serif;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}
.btn-ghost:hover {
  background: rgb(var(--color-bg-page));
  color: #334155;
}

/* ─── Layout ────────────────────────────────────────────────────────────── */
.dashboard-content {
  max-width: 1400px;
  margin: 0 auto;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

@media (max-width: 480px) {
  .dashboard-content {
    padding: 1rem;
    gap: 1rem;
  }
}

/* ─── Hero ──────────────────────────────────────────────────────────────── */


@media (max-width: 640px) {
  .hero-header {
    padding: 1.5rem;
    border-radius: 18px;
  }
}

















.hero-badge--warning .badge-dot {
  background: #ef4444;
}

.fallback-banner {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 14px 18px;
  margin: 0 0 1.25rem;
  background: rgba(239, 68, 68, 0.08);
  border: 1px solid rgba(239, 68, 68, 0.25);
  border-radius: 12px;
  color: #b91c1c;
  font-size: 0.875rem;
  font-weight: 500;
}

.fallback-banner svg {
  width: 20px;
  height: 20px;
  flex-shrink: 0;
  color: #ef4444;
}

.badge-dot {
  width: 7px;
  height: 7px;
  background: #10b981;
  border-radius: 50%;
  animation: pulse-dot 2s ease-in-out infinite;
}

@keyframes pulse-dot {
  0%,
  100% {
    opacity: 1;
    transform: scale(1);
  }
  50% {
    opacity: 0.5;
    transform: scale(0.8);
  }
}











.perf-label {
  color: rgba(255, 255, 255, 0.5);
  font-size: 0.78rem;
  margin-bottom: 0.5rem;
}

.perf-value {
  display: flex;
  align-items: baseline;
  gap: 10px;
  margin-bottom: 1rem;
}

.perf-num {
  font-size: 2.5rem;
  font-weight: 800;
  color: #fff;
  line-height: 1;
}

.perf-unit {
  font-size: 1.2rem;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.6);
}

.perf-delta {
  font-size: 0.85rem;
  font-weight: 700;
  color: #34d399;
  background: rgba(16, 185, 129, 0.15);
  padding: 2px 8px;
  border-radius: 6px;
}

.perf-bar {
  height: 4px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 99px;
  overflow: hidden;
  margin-bottom: 0.75rem;
}

.perf-fill {
  height: 100%;
  background: linear-gradient(90deg, #6366f1, #8b5cf6, #a78bfa);
  border-radius: 99px;
  transition: width 1s ease;
}

.perf-sub {
  color: rgba(255, 255, 255, 0.35);
  font-size: 0.72rem;
}

/* ─── KPI Grid ──────────────────────────────────────────────────────────── */
.kpi-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1rem;
}

@media (max-width: 1100px) {
  .kpi-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
@media (max-width: 640px) {
  .kpi-grid {
    grid-template-columns: 1fr;
  }
}

.kpi-card {
  position: relative;
  background: #fff;
  border-radius: 20px;
  padding: 1.5rem;
  overflow: hidden;
  border: 1px solid #f1f5f9;
  transition:
    transform 0.25s,
    box-shadow 0.25s;
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}

.kpi-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.08);
}

.kpi-glow {
  position: absolute;
  inset: 0;
  opacity: 0;
  transition: opacity 0.3s;
  border-radius: inherit;
}

.kpi-card:hover .kpi-glow {
  opacity: 1;
}

.kpi-green .kpi-glow {
  background: radial-gradient(circle at 80% 20%, rgba(16, 185, 129, 0.08), transparent 60%);
}
.kpi-blue .kpi-glow {
  background: radial-gradient(circle at 80% 20%, rgba(99, 102, 241, 0.08), transparent 60%);
}
.kpi-purple .kpi-glow {
  background: radial-gradient(circle at 80% 20%, rgba(139, 92, 246, 0.08), transparent 60%);
}
.kpi-amber .kpi-glow {
  background: radial-gradient(circle at 80% 20%, rgba(245, 158, 11, 0.08), transparent 60%);
}

.kpi-top {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: 0.5rem;
}

.kpi-icon-wrap {
  width: 44px;
  height: 44px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.kpi-icon-wrap svg {
  width: 22px;
  height: 22px;
}

.kpi-green .kpi-icon-wrap {
  background: #ecfdf5;
  color: #059669;
}
.kpi-blue .kpi-icon-wrap {
  background: #eef2ff;
  color: #6366f1;
}
.kpi-purple .kpi-icon-wrap {
  background: #f5f3ff;
  color: #7c3aed;
}
.kpi-amber .kpi-icon-wrap {
  background: #fffbeb;
  color: #d97706;
}

.kpi-trend {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 0.75rem;
  font-weight: 700;
  padding: 4px 8px;
  border-radius: 8px;
}

.kpi-trend svg {
  width: 10px;
  height: 10px;
}

.trend-up {
  background: #f0fdf4;
  color: #16a34a;
}
.trend-down {
  background: #fef2f2;
  color: #dc2626;
}

.kpi-radial {
  width: 44px;
  height: 44px;
}
.radial-svg {
  width: 44px;
  height: 44px;
  transform: rotate(-90deg);
}
.radial-bg {
  stroke: #f1f5f9;
}
.radial-fill {
  stroke: #d97706;
  stroke-linecap: round;
  transition: stroke-dasharray 1s ease;
}

.kpi-value {
  font-size: 1.65rem;
  font-weight: 800;
  color: #0f172a;
  line-height: 1;
}

.kpi-unit {
  font-size: 1rem;
  font-weight: 600;
  color: #94a3b8;
}

.kpi-label {
  font-size: 0.8rem;
  color: #94a3b8;
  font-weight: 500;
}

.kpi-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 0.25rem;
}

.kpi-period {
  font-size: 0.72rem;
  color: #cbd5e1;
}

.kpi-action {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 0.75rem;
  font-weight: 600;
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 6px;
  transition: all 0.2s;
  opacity: 0;
}

.kpi-card:hover .kpi-action {
  opacity: 1;
}

.kpi-action svg {
  width: 12px;
  height: 12px;
}

.kpi-green .kpi-action {
  color: #059669;
}
.kpi-blue .kpi-action {
  color: #6366f1;
}
.kpi-purple .kpi-action {
  color: #7c3aed;
}

.kpi-progress-wrap {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 0.25rem;
}

.kpi-progress-track {
  flex: 1;
  height: 4px;
  background: #f1f5f9;
  border-radius: 99px;
  overflow: hidden;
}

.kpi-progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #f59e0b, #d97706);
  border-radius: 99px;
  transition: width 1s ease;
}

.kpi-progress-label {
  font-size: 0.7rem;
  color: #94a3b8;
  white-space: nowrap;
}

.kpi-bar-track {
  height: 3px;
  background: rgb(var(--color-bg-page));
  border-radius: 99px;
  overflow: hidden;
  margin: 0.75rem -1.5rem -1.5rem;
  position: relative;
}

.kpi-bar-fill {
  height: 100%;
  border-radius: 99px;
  transition: width 1s ease;
}

.kpi-green .kpi-bar-fill {
  background: linear-gradient(90deg, #10b981, #059669);
}
.kpi-blue .kpi-bar-fill {
  background: linear-gradient(90deg, #818cf8, #6366f1);
}
.kpi-purple .kpi-bar-fill {
  background: linear-gradient(90deg, #a78bfa, #7c3aed);
}
.kpi-amber .kpi-bar-fill {
  background: linear-gradient(90deg, #fcd34d, #d97706);
}

/* ─── Chart Cards ───────────────────────────────────────────────────────── */
.charts-row {
  display: grid;
  grid-template-columns: 1.6fr 1fr;
  gap: 1rem;
}

@media (max-width: 1024px) {
  .charts-row {
    grid-template-columns: 1fr;
  }
}

.chart-card {
  background: #fff;
  border-radius: 20px;
  border: 1px solid #f1f5f9;
  overflow: hidden;
}

.chart-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  padding: 1.25rem 1.5rem;
  border-bottom: 1px solid #f8fafc;
  flex-wrap: wrap;
  gap: 0.75rem;
}

.chart-title {
  font-size: 1rem;
  font-weight: 700;
  color: #0f172a;
  margin: 0 0 0.2rem;
  display: flex;
  align-items: center;
  gap: 8px;
}

.title-icon {
  width: 18px;
  height: 18px;
}
.title-icon.amber {
  color: #d97706;
}

.chart-sub {
  font-size: 0.78rem;
  color: #94a3b8;
  margin: 0;
}

.chart-body {
  padding: 1.5rem;
}

.h-80 {
  height: 320px;
}
.h-72 {
  height: 288px;
}

/* Period Tabs */
.period-tabs {
  display: flex;
  background: rgb(var(--color-bg-page));
  border-radius: 10px;
  padding: 3px;
  border: 1px solid #f1f5f9;
}

.period-btn {
  padding: 5px 12px;
  font-size: 0.75rem;
  font-weight: 600;
  border: none;
  background: none;
  border-radius: 7px;
  cursor: pointer;
  color: #94a3b8;
  font-family: 'Cairo', sans-serif;
  transition: all 0.2s;
}

.period-btn.active {
  background: #fff;
  color: #6366f1;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.08);
}

.period-btn:not(.active):hover {
  color: #475569;
}

/* View Link */
.view-link {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 0.78rem;
  font-weight: 600;
  color: #6366f1;
  background: #eef2ff;
  border: none;
  border-radius: 8px;
  padding: 6px 12px;
  cursor: pointer;
  font-family: 'Cairo', sans-serif;
  transition: all 0.2s;
  white-space: nowrap;
}

.view-link:hover {
  background: #e0e7ff;
}
.view-link svg {
  width: 12px;
  height: 12px;
}

/* Chart Footer Stats */
.chart-footer-stats {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem 1.5rem;
  border-top: 1px solid #f8fafc;
  background: #fafbfc;
}

.chart-stat {
  flex: 1;
  text-align: center;
}
.chart-stat-label {
  display: block;
  font-size: 0.72rem;
  color: #94a3b8;
  margin-bottom: 0.2rem;
}
.chart-stat-val {
  font-size: 0.95rem;
  font-weight: 700;
  color: #0f172a;
}
.chart-stat-val.green {
  color: #059669;
}
.chart-stat-divider {
  width: 1px;
  height: 32px;
  background: #f1f5f9;
}

/* Donut Chart */
.donut-wrap {
  height: 220px;
}

.status-list {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-top: 1rem;
}

.status-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 12px;
  border-radius: 12px;
  border: 1px solid transparent;
  cursor: pointer;
  transition: all 0.2s;
}

.status-item:hover {
  background: rgb(var(--color-bg-page));
  border-color: #f1f5f9;
}

.status-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  flex-shrink: 0;
}

.status-info {
  flex: 1;
  min-width: 0;
}
.status-name {
  display: block;
  font-size: 0.82rem;
  font-weight: 600;
  color: #334155;
}
.status-amount {
  display: block;
  font-size: 0.7rem;
  color: #94a3b8;
}

.status-nums {
  text-align: left;
}
.status-count {
  display: block;
  font-size: 0.85rem;
  font-weight: 700;
  color: #0f172a;
}
.status-pct {
  font-size: 0.72rem;
  font-weight: 600;
}

/* ─── Bottom Row ────────────────────────────────────────────────────────── */
.bottom-row {
  display: grid;
  grid-template-columns: 1.6fr 1fr;
  gap: 1rem;
  align-items: start;
}

@media (max-width: 1024px) {
  .bottom-row {
    grid-template-columns: 1fr;
  }
}

.bottom-main {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
.bottom-side {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

/* Legend */
.legend-row {
  display: flex;
  align-items: center;
  gap: 12px;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.78rem;
  color: #64748b;
  font-weight: 500;
}

.legend-item::before {
  content: '';
  display: block;
  width: 10px;
  height: 10px;
  border-radius: 3px;
}

.legend-item.blue::before {
  background: #6366f1;
}
.legend-item.green::before {
  background: #10b981;
}

/* Header Actions */
.header-actions {
  display: flex;
  align-items: center;
  gap: 8px;
}

.icon-btn {
  width: 34px;
  height: 34px;
  background: rgb(var(--color-bg-page));
  border: 1px solid #f1f5f9;
  border-radius: 9px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
  color: #64748b;
}

.icon-btn:hover {
  background: #f1f5f9;
  color: #334155;
}
.icon-btn svg {
  width: 15px;
  height: 15px;
}

.text-btn {
  background: none;
  border: none;
  cursor: pointer;
  font-family: 'Cairo', sans-serif;
  font-size: 0.8rem;
  font-weight: 600;
  color: #6366f1;
  padding: 4px 8px;
  border-radius: 6px;
  transition: all 0.2s;
}

.text-btn:hover {
  background: #eef2ff;
}

/* Activity List */
.activity-list {
  padding: 0.5rem 1.5rem 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.activity-item {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 12px;
  border-radius: 14px;
  cursor: pointer;
  transition: background 0.2s;
}

.activity-item:hover {
  background: rgb(var(--color-bg-page));
}

.act-icon {
  width: 42px;
  height: 42px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.9rem;
  flex-shrink: 0;
  transition: transform 0.2s;
}

.activity-item:hover .act-icon {
  transform: scale(1.08);
}

.act-green {
  background: #ecfdf5;
  color: #059669;
}
.act-blue {
  background: #eef2ff;
  color: #6366f1;
}
.act-purple {
  background: #f5f3ff;
  color: #7c3aed;
}
.act-teal {
  background: #f0fdfa;
  color: #0d9488;
}
.act-gray {
  background: rgb(var(--color-bg-page));
  color: #64748b;
}

.act-body {
  flex: 1;
  min-width: 0;
}
.act-title {
  font-size: 0.85rem;
  font-weight: 700;
  color: #0f172a;
  margin: 0 0 2px;
}
.act-desc {
  font-size: 0.75rem;
  color: #64748b;
  margin: 0 0 4px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.act-time {
  font-size: 0.7rem;
  color: #cbd5e1;
  margin: 0;
}

.act-right {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 4px;
}
.act-amount {
  font-size: 0.85rem;
  font-weight: 700;
  color: #0f172a;
  white-space: nowrap;
}
.act-arrow {
  width: 14px;
  height: 14px;
  color: #cbd5e1;
  transition:
    color 0.2s,
    transform 0.2s;
}
.activity-item:hover .act-arrow {
  color: #6366f1;
  transform: translateX(-2px);
}

/* Quick Actions */
.quick-actions {
  padding: 0 1.5rem 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
}

.qa-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px;
  border-radius: 14px;
  text-decoration: none;
  transition: all 0.25s;
  border: 1px solid transparent;
}

.qa-blue {
  background: #f5f7ff;
  color: #6366f1;
  border-color: #e0e7ff;
}
.qa-blue:hover {
  background: #eef2ff;
  border-color: #c7d2fe;
  box-shadow: 0 4px 12px rgba(99, 102, 241, 0.12);
}

.qa-green {
  background: #f0fdf8;
  color: #059669;
  border-color: #d1fae5;
}
.qa-green:hover {
  background: #ecfdf5;
  border-color: #a7f3d0;
  box-shadow: 0 4px 12px rgba(16, 185, 129, 0.12);
}

.qa-purple {
  background: #f8f5ff;
  color: #7c3aed;
  border-color: #ede9fe;
}
.qa-purple:hover {
  background: #f5f3ff;
  border-color: #ddd6fe;
  box-shadow: 0 4px 12px rgba(124, 58, 237, 0.12);
}

.qa-icon {
  width: 38px;
  height: 38px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  transition: transform 0.2s;
}

.qa-item:hover .qa-icon {
  transform: scale(1.1);
}

.qa-blue .qa-icon {
  background: #e0e7ff;
}
.qa-green .qa-icon {
  background: #d1fae5;
}
.qa-purple .qa-icon {
  background: #ede9fe;
}

.qa-icon svg {
  width: 18px;
  height: 18px;
}

.qa-text {
  flex: 1;
}
.qa-title {
  display: block;
  font-size: 0.85rem;
  font-weight: 700;
  color: #0f172a;
}
.qa-desc {
  display: block;
  font-size: 0.72rem;
  color: #94a3b8;
  margin-top: 1px;
}

.qa-arrow {
  width: 14px;
  height: 14px;
  opacity: 0;
  transition:
    opacity 0.2s,
    transform 0.2s;
}
.qa-item:hover .qa-arrow {
  opacity: 1;
  transform: translateX(-2px);
}

/* Clients List */
.clients-list {
  padding: 0.5rem 1.5rem 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
}

.client-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 12px;
  border-radius: 14px;
  cursor: pointer;
  transition: background 0.2s;
}

.client-item:hover {
  background: rgb(var(--color-bg-page));
}

.client-rank-wrap {
  position: relative;
  flex-shrink: 0;
}

.client-avatar {
  width: 40px;
  height: 40px;
  background: linear-gradient(135deg, #6366f1, #8b5cf6);
  border-radius: 11px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-size: 0.8rem;
  font-weight: 700;
  transition: transform 0.2s;
}

.client-item:hover .client-avatar {
  transform: scale(1.06);
}

.client-rank {
  position: absolute;
  top: -4px;
  right: -4px;
  width: 18px;
  height: 18px;
  background: linear-gradient(135deg, #f59e0b, #d97706);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-size: 0.6rem;
  font-weight: 800;
  border: 2px solid #fff;
}

.client-info {
  flex: 1;
  min-width: 0;
}
.client-name {
  font-size: 0.85rem;
  font-weight: 700;
  color: #0f172a;
  margin: 0 0 2px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.client-company {
  font-size: 0.72rem;
  color: #94a3b8;
  margin: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.client-stats {
  text-align: left;
}
.client-spent {
  display: block;
  font-size: 0.82rem;
  font-weight: 700;
  color: #0f172a;
  white-space: nowrap;
}
.client-growth {
  font-size: 0.7rem;
  font-weight: 700;
}
.client-growth.up {
  color: #059669;
}
.client-growth.down {
  color: #dc2626;
}

/* Empty States */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
  padding: 2rem;
  text-align: center;
  color: #94a3b8;
}

.empty-state svg {
  width: 48px;
  height: 48px;
  opacity: 0.4;
}
.empty-state p {
  font-size: 0.85rem;
  margin: 0;
}
.empty-state.small {
  padding: 1rem;
}
.empty-state.small p {
  font-size: 0.8rem;
}

/* ============================================================
   الوضع الداكن (Dark Mode)
   ============================================================
   هذا المكوّن لا يستخدم كلاسات Tailwind (bg-white, text-gray-900...)
   زي باقي صفحات المشروع — عنده نظام تصميم خاص فيه بألوان HEX
   مباشرة داخل <style scoped>. لذلك تعديلات style.css المركزية
   (اللي تستهدف أسماء كلاسات Tailwind) ما تصل له إطلاقاً، واحتاج
   مجموعة قواعد ".dark" خاصة فيه هنا، بنفس درجات اللون المستخدمة
   بباقي المشروع (slate-800/900/950) للتناسق البصري.
   ============================================================ */
.dark .dashboard-root {
  background: rgb(var(--color-bg-page));
}

.dark .loading-text {
  color: #e2e8f0;
}

.dark .error-card {
  background: rgb(var(--color-bg-white dark:bg-slate-800));
  border-color: rgba(239, 68, 68, 0.25);
}
.dark .error-icon-wrap {
  background: rgba(239, 68, 68, 0.12);
}
.dark .error-card h3 {
  color: #f8fafc;
}
.dark .error-card p {
  color: #94a3b8;
}
.dark .btn-ghost {
  color: #94a3b8;
  border-color: #334155;
}
.dark .btn-ghost:hover {
  background: rgb(var(--color-bg-white dark:bg-slate-800));
  color: #e2e8f0;
}

/* البطاقات الأساسية (KPI + Charts) */
.dark .kpi-card,
.dark .chart-card {
  background: rgb(var(--color-bg-white dark:bg-slate-800));
  border-color: #334155;
}
.dark .kpi-value,
.dark .chart-title,
.dark .chart-stat-val,
.dark .status-count,
.dark .act-title,
.dark .act-amount,
.dark .client-name,
.dark .client-spent,
.dark .qa-title {
  color: #f8fafc;
}
.dark .status-name {
  color: #cbd5e1;
}
.dark .chart-header {
  border-bottom-color: #334155;
}
.dark .chart-footer-stats {
  background: rgb(var(--color-bg-white dark:bg-slate-800));
  border-top-color: #334155;
}
.dark .chart-stat-divider,
.dark .radial-bg,
.dark .kpi-progress-track {
  background: #334155;
  stroke: #334155;
}

/* أشرطة التقدّم والفواصل الرفيعة أسفل بطاقات KPI */
.dark .kpi-bar-track {
  background: rgb(var(--color-bg-white dark:bg-slate-800));
}

/* تبويبات الفترة الزمنية (1M/3M/6M/1Y) */
.dark .period-tabs {
  background: rgb(var(--color-bg-white dark:bg-slate-800));
  border-color: #334155;
}
.dark .period-btn.active {
  background: rgb(var(--color-bg-white dark:bg-slate-800));
  color: #a5b4fc;
}
.dark .period-btn:not(.active):hover {
  color: #cbd5e1;
}

/* حالات التمرير (hover) على العناصر القابلة للنقر */
.dark .status-item:hover {
  background: rgb(var(--color-bg-white dark:bg-slate-800));
  border-color: #334155;
}
.dark .icon-btn {
  background: rgb(var(--color-bg-white dark:bg-slate-800));
  border-color: #334155;
  color: #94a3b8;
}
.dark .icon-btn:hover {
  background: #334155;
  color: #f1f5f9;
}
.dark .activity-item:hover,
.dark .client-item:hover {
  background: rgb(var(--color-bg-white dark:bg-slate-800));
}

/* روابط وأزرار بألوان تمييز فاتحة — نحوّلها لنسخة شفافة تناسب الخلفية الداكنة */
.dark .view-link,
.dark .text-btn:hover {
  background: rgba(99, 102, 241, 0.15);
  color: #a5b4fc;
}
.dark .qa-blue {
  background: rgba(99, 102, 241, 0.1);
  border-color: rgba(99, 102, 241, 0.25);
}
.dark .qa-green {
  background: rgba(16, 185, 129, 0.1);
  border-color: rgba(16, 185, 129, 0.25);
}
.dark .qa-purple {
  background: rgba(124, 58, 237, 0.1);
  border-color: rgba(124, 58, 237, 0.25);
}
.dark .qa-blue .qa-icon {
  background: rgba(99, 102, 241, 0.2);
}
.dark .qa-green .qa-icon {
  background: rgba(16, 185, 129, 0.2);
}
.dark .qa-purple .qa-icon {
  background: rgba(124, 58, 237, 0.2);
}

/* أيقونات بطاقات KPI ونشاطات القائمة — نفس فكرة الشفافية أعلاه */
.dark .kpi-green .kpi-icon-wrap {
  background: rgba(5, 150, 105, 0.15);
}
.dark .kpi-blue .kpi-icon-wrap {
  background: rgba(99, 102, 241, 0.15);
}
.dark .kpi-purple .kpi-icon-wrap {
  background: rgba(124, 58, 237, 0.15);
}
.dark .kpi-amber .kpi-icon-wrap {
  background: rgba(217, 119, 6, 0.15);
}
.dark .act-green {
  background: rgba(5, 150, 105, 0.15);
}
.dark .act-blue {
  background: rgba(99, 102, 241, 0.15);
}
.dark .act-purple {
  background: rgba(124, 58, 237, 0.15);
}
.dark .act-teal {
  background: rgba(13, 148, 136, 0.15);
}
.dark .act-gray {
  background: rgb(var(--color-bg-white dark:bg-slate-800));
  color: #94a3b8;
}
.dark .trend-up {
  background: rgba(22, 163, 74, 0.15);
}
.dark .trend-down {
  background: rgba(220, 38, 38, 0.15);
}

/* أوصاف ثانوية باهتة — تفتيح بسيط ليبقى التباين مريحاً على خلفية داكنة */
.dark .act-desc,
.dark .client-company,
.dark .qa-desc,
.dark .status-amount {
  color: #64748b;
}

    /* Hero Header (Rich Colors) */
    .hero-header {
      position: relative;
      border-radius: 24px;
      overflow: hidden;
      background: #0f172a !important; /* أزرق داكن جداً */
      padding: 2.5rem !important;
      color: #ffffff;
    }
    .hero-bg {
      position: absolute;
      inset: 0;
      overflow: hidden;
    }
    .hero-mesh {
      position: absolute;
      border-radius: 50%;
      filter: blur(60px);
      opacity: 0.35;
    }
    .mesh-1 {
      width: 500px; height: 500px;
      top: -200px; right: -100px;
      background: rgb(var(--color-primary-500)) !important; /* أزرق */
    }
    .mesh-2 {
      width: 350px; height: 350px;
      bottom: -150px; left: 200px;
      background: #8b5cf6 !important; /* بنفسجي */
    }
    .mesh-3 {
      width: 250px; height: 250px;
      top: 50px; left: -50px;
      background: #06b6d4 !important; /* تركوازي */
      opacity: 0.2;
    }
    .hero-inner {
      position: relative;
      display: flex;
      align-items: center;
      justify-content: space-between;
      flex-wrap: wrap;
      gap: 2rem;
    }
    .hero-badge {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 6px 14px;
      background: rgba(16, 185, 129, 0.15);
      border: 1px solid rgba(16, 185, 129, 0.3);
      border-radius: 100px;
      margin-bottom: 1rem;
      color: #34d399;
      font-size: 0.78rem;
      font-weight: 600;
    }
    .hero-badge--warning {
      background: rgba(239, 68, 68, 0.15);
      border-color: rgba(239, 68, 68, 0.3);
      color: #f87171;
    }
    .hero-title {
      font-size: 2rem;
      font-weight: 800;
      color: #fff !important;
      margin: 0 0 0.5rem;
      line-height: 1.2;
    }
    .hero-name {
      background: linear-gradient(135deg, #a5b4fc, #c4b5fd, #93c5fd) !important;
      -webkit-background-clip: text !important;
      -webkit-text-fill-color: transparent !important;
      background-clip: text !important;
    }
    .hero-subtitle {
      color: rgba(255, 255, 255, 0.55) !important;
      font-size: 0.9rem;
      margin: 0;
    }
    .hero-perf {
      background: rgba(255, 255, 255, 0.06);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 18px;
      padding: 1.5rem 2rem;
      min-width: 220px;
      backdrop-filter: blur(10px);
    }
    </style>
