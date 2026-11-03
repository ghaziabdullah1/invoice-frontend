<template>
  <div class="flex min-h-screen bg-gray-50/80" :dir="$i18n.locale === 'ar' ? 'rtl' : 'ltr'"
    :class="{ 'overflow-hidden': sidebarOpen && isMobile }">
    <!-- Mobile Overlay -->
    <Transition enter-active-class="transition-opacity duration-300 ease-out" enter-from-class="opacity-0"
      enter-to-class="opacity-100" leave-active-class="transition-opacity duration-200 ease-in"
      leave-from-class="opacity-100" leave-to-class="opacity-0">
      <div v-if="sidebarOpen && isMobile" class="fixed inset-0 bg-gray-900/60 backdrop-blur-sm z-40"
        @click="toggleSidebar"></div>
    </Transition>

    <!-- Sidebar -->
    <aside :class="[
      'fixed md:relative top-0 bottom-0 bg-slate-900 text-white shadow-2xl z-50 transition-transform duration-300 ease-out will-change-transform',
      isMobile
        ? sidebarOpen
          ? 'translate-x-0 w-72'
          : $i18n.locale === 'ar'
            ? 'translate-x-full w-72'
            : '-translate-x-full w-72'
        : sidebarOpen
          ? 'translate-x-0 w-64'
          : 'translate-x-0 w-20',
      $i18n.locale === 'ar' ? 'right-0' : 'left-0',
    ]">
      <div class="h-full flex flex-col min-h-screen"
        :class="{ 'p-4': sidebarOpen || !isMobile, 'p-2': !isMobile && !sidebarOpen }">
        <!-- Logo / Brand -->
        <div class="flex items-center justify-center h-16 mb-6" :class="!sidebarOpen && !isMobile ? 'px-0' : 'px-2'">
          <div class="flex items-center gap-3 transition-all duration-300"
            :class="!sidebarOpen && !isMobile ? 'scale-90' : ''">
            <div
              class="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/30 flex-shrink-0">
              <svg class="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"
                stroke-linecap="round" stroke-linejoin="round">
                <path
                  d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
              </svg>
            </div>
            <Transition name="fade">
              <span v-if="sidebarOpen" class="text-xl font-bold tracking-tight text-white">
                {{ t('app.name', 'System') }}
              </span>
            </Transition>
          </div>
        </div>

        <!-- Navigation -->
        <nav class="space-y-1 flex-1 overflow-y-auto custom-scrollbar">

          <!-- Collapse Sidebar Button -->
          <div class="mb-2">
            <button @click="toggleSidebar"
              class="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-400 hover:bg-slate-800/60 hover:text-white transition-all duration-200 group">
              <svg class="w-5 h-5 flex-shrink-0 transition-transform duration-300"
                :class="{ 'rotate-180': !sidebarOpen }" fill="none" stroke="currentColor" viewBox="0 0 24 24"
                stroke-width="1.5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 5.25h16.5M3.75 12h16.5M3.75 18.75h16.5" />
              </svg>

              <span v-if="sidebarOpen" class="text-sm font-medium">
                {{ t('nav.collapse_menu') }}
              </span>
            </button>
          </div>

          <!-- Profile -->
          <div v-if="user">
            <router-link v-if="!sidebarOpen && !isMobile" to="/profile" :title="t('nav.profile')"
              class="flex items-center justify-center p-3 rounded-xl hover:bg-slate-800/80 transition-all duration-200 group relative"
              :class="{
                'bg-blue-500/10 text-blue-400': $route.path === '/profile',
                'text-slate-400': $route.path !== '/profile',
              }">
              <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"
                stroke-linecap="round" stroke-linejoin="round">
                <path
                  d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
              </svg>
            </router-link>

            <router-link v-else to="/profile" @click="closeSidebarOnMobile"
              class="flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group relative" :class="{
                'bg-gradient-to-r from-blue-500/20 to-blue-500/5 text-blue-400 border border-blue-500/20 shadow-sm shadow-blue-500/10':
                  $route.path === '/profile',
                'text-slate-400 hover:bg-slate-800/60 hover:text-white': $route.path !== '/profile',
              }">
              <svg class="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                <path
                  d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
              </svg>
              <span v-if="sidebarOpen" class="text-sm font-medium transition-colors">
                {{ t('nav.profile') }}
              </span>
              <div v-if="$route.path === '/profile'"
                class="absolute top-1/2 -translate-y-1/2 w-1 h-8 rounded-full bg-blue-500"
                :class="$i18n.locale === 'ar' ? 'right-0' : 'left-0'"></div>
            </router-link>
          </div>

          <div v-if="sidebarOpen" class="pt-4 mt-2 border-t border-slate-700/50"></div>
          <div v-else class="pt-2 mt-2 border-t border-slate-700/50 mx-2"></div>

          <!-- Dashboard -->
          <router-link v-if="hasPermission('dashboard')" to="/dashboard" @click="closeSidebarOnMobile"
            class="flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group relative" :class="[
              !sidebarOpen && !isMobile ? 'justify-center' : '',
              $route.path === '/dashboard'
                ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20 shadow-sm shadow-blue-500/10'
                : 'text-slate-400 hover:bg-slate-800/60 hover:text-white',
            ]" :title="!sidebarOpen && !isMobile ? t('nav.dashboard') : ''">
            <svg class="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"
              stroke-linecap="round" stroke-linejoin="round">
              <path
                d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
            </svg>
            <span v-if="sidebarOpen" class="text-sm font-medium transition-colors">
              {{ t('nav.dashboard') }}
            </span>
            <div v-if="$route.path === '/dashboard'"
              class="absolute top-1/2 -translate-y-1/2 w-1 h-6 rounded-full bg-blue-500"
              :class="$i18n.locale === 'ar' ? 'right-0' : 'left-0'"></div>
          </router-link>

          <!-- Clients -->
          <router-link v-if="hasPermission('view_clients')" to="/clients" @click="closeSidebarOnMobile"
            class="flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group relative" :class="[
              !sidebarOpen && !isMobile ? 'justify-center' : '',
              $route.path === '/clients'
                ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20 shadow-sm shadow-blue-500/10'
                : 'text-slate-400 hover:bg-slate-800/60 hover:text-white',
            ]" :title="!sidebarOpen && !isMobile ? t('nav.clients') : ''">
            <svg class="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"
              stroke-linecap="round" stroke-linejoin="round">
              <path
                d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
            </svg>
            <span v-if="sidebarOpen" class="text-sm font-medium transition-colors">
              {{ t('nav.clients') }}
            </span>
            <div v-if="$route.path === '/clients'"
              class="absolute top-1/2 -translate-y-1/2 w-1 h-6 rounded-full bg-blue-500"
              :class="$i18n.locale === 'ar' ? 'right-0' : 'left-0'"></div>
          </router-link>

          <!-- Invoices -->
          <router-link v-if="hasPermission('view_invoices')" to="/invoices" @click="closeSidebarOnMobile"
            class="flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group relative" :class="[
              !sidebarOpen && !isMobile ? 'justify-center' : '',
              $route.path.includes('/invoices')
                ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20 shadow-sm shadow-blue-500/10'
                : 'text-slate-400 hover:bg-slate-800/60 hover:text-white',
            ]" :title="!sidebarOpen && !isMobile ? t('nav.invoices') : ''">
            <svg class="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"
              stroke-linecap="round" stroke-linejoin="round">
              <path
                d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25z" />
            </svg>
            <span v-if="sidebarOpen" class="text-sm font-medium transition-colors">
              {{ t('nav.invoices') }}
            </span>
            <div v-if="
              $route.path.includes('/invoices') && !$route.path.includes('/recurring-invoices')
            " class="absolute top-1/2 -translate-y-1/2 w-1 h-6 rounded-full bg-blue-500"
              :class="$i18n.locale === 'ar' ? 'right-0' : 'left-0'"></div>
          </router-link>
          <!-- Recurring Invoices -->
          <router-link v-if="hasPermission('view_invoices')" to="/recurring-invoices" @click="closeSidebarOnMobile"
            class="flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group relative" :class="[
              !sidebarOpen && !isMobile ? 'justify-center' : '',
              $route.path.includes('/recurring-invoices')
                ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20 shadow-sm shadow-blue-500/10'
                : 'text-slate-400 hover:bg-slate-800/60 hover:text-white',
            ]" :title="!sidebarOpen && !isMobile ? t('nav.recurring_invoices') || 'Recurring Invoices' : ''
              ">
            <svg class="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"
              stroke-linecap="round" stroke-linejoin="round">
              <path stroke-linecap="round" stroke-linejoin="round"
                d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
            </svg>
            <span v-if="sidebarOpen" class="text-sm font-medium transition-colors">
              {{ t('nav.recurring_invoices') || 'Recurring Invoices' }}
            </span>
            <div v-if="$route.path.includes('/recurring-invoices')"
              class="absolute top-1/2 -translate-y-1/2 w-1 h-6 rounded-full bg-blue-500"
              :class="$i18n.locale === 'ar' ? 'right-0' : 'left-0'"></div>
          </router-link>

          <!-- Reports -->
          <router-link v-if="hasPermission('view_reports')" to="/reports" @click="closeSidebarOnMobile"
            class="flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group relative" :class="[
              !sidebarOpen && !isMobile ? 'justify-center' : '',
              $route.path === '/reports'
                ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20 shadow-sm shadow-blue-500/10'
                : 'text-slate-400 hover:bg-slate-800/60 hover:text-white',
            ]" :title="!sidebarOpen && !isMobile ? t('nav.reports') : ''">
            <svg class="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"
              stroke-linecap="round" stroke-linejoin="round">
              <path
                d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
            </svg>
            <span v-if="sidebarOpen" class="text-sm font-medium transition-colors">
              {{ t('nav.reports') }}
            </span>
            <div v-if="$route.path === '/reports'"
              class="absolute top-1/2 -translate-y-1/2 w-1 h-6 rounded-full bg-blue-500"
              :class="$i18n.locale === 'ar' ? 'right-0' : 'left-0'"></div>
          </router-link>

          <!-- Property Management -->
          <template v-if="propertyNavItems.length">
            <div v-if="sidebarOpen" class="pt-4 mt-2 border-t border-slate-700/50">
              <p class="px-3 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                {{ t('nav.properties_section', 'Property Management') }}
              </p>
            </div>
            <div v-else class="pt-2 mt-2 border-t border-slate-700/50 mx-2"></div>

            <!-- Branches -->
            <router-link v-if="hasPermission('administration')" to="/admin/branches" @click="closeSidebarOnMobile"
              class="flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group relative" :class="[
                !sidebarOpen && !isMobile ? 'justify-center' : '',
                $route.path.includes('/admin/branches')
                  ? 'bg-purple-500/10 text-purple-400 border border-purple-500/20 shadow-sm shadow-purple-500/10'
                  : 'text-slate-400 hover:bg-slate-800/60 hover:text-white',
              ]" :title="!sidebarOpen && !isMobile ? t('nav.branches') : ''">
              <svg class="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                <path
                  d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6H15m-1.5 3H15m-1.5 3H15M9 21v-3.375c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125V21" />
              </svg>
              <span v-if="sidebarOpen" class="text-sm font-medium transition-colors">
                {{ t('nav.branches') }}
              </span>
              <div v-if="$route.path.includes('/admin/branches')"
                class="absolute top-1/2 -translate-y-1/2 w-1 h-6 rounded-full bg-purple-500"
                :class="$i18n.locale === 'ar' ? 'right-0' : 'left-0'"></div>
            </router-link>

            <!-- Property Navigation Items -->
            <router-link v-for="item in propertyNavItems" :key="item.to" :to="item.to" @click="closeSidebarOnMobile"
              class="flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group relative" :class="[
                !sidebarOpen && !isMobile ? 'justify-center' : '',
                $route.path === item.to || $route.path.startsWith(item.to + '/')
                  ? 'bg-teal-500/10 text-teal-400 border border-teal-500/20 shadow-sm shadow-teal-500/10'
                  : 'text-slate-400 hover:bg-slate-800/60 hover:text-white',
              ]" :title="!sidebarOpen && !isMobile ? t(item.label) : ''">
              <svg class="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                <path :d="item.icon" />
              </svg>
              <span v-if="sidebarOpen" class="text-sm font-medium transition-colors">
                {{ t(item.label) }}
              </span>
              <div v-if="$route.path === item.to || $route.path.startsWith(item.to + '/')"
                class="absolute top-1/2 -translate-y-1/2 w-1 h-6 rounded-full bg-teal-500"
                :class="$i18n.locale === 'ar' ? 'right-0' : 'left-0'"></div>
            </router-link>

          </template>

          <!-- AI Drafts -->
          <router-link v-if="hasPermission('view_ai_drafts')" to="/ai-drafts" @click="closeSidebarOnMobile"
            class="flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group relative" :class="[
              !sidebarOpen && !isMobile ? 'justify-center' : '',
              $route.path.startsWith('/ai-drafts')
                ? 'bg-teal-500/10 text-teal-400 border border-teal-500/20 shadow-sm shadow-teal-500/10'
                : 'text-slate-400 hover:bg-slate-800/60 hover:text-white',
            ]" :title="!sidebarOpen && !isMobile ? t('nav.ai_drafts') : ''">
            <svg class="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor"
              stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
              <path
                d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zM2.25 12.76c0 1.6 1.123 2.994 2.707 3.227 1.087.16 2.185.283 3.293.369V21l4.184-4.183a1.14 1.14 0 01.778-.332 48.294 48.294 0 005.83-.498c1.585-.233 2.708-1.626 2.708-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" />
            </svg>
            <span v-if="sidebarOpen" class="text-sm font-medium transition-colors">
              {{ t('nav.ai_drafts') }}
            </span>
            <div v-if="$route.path.startsWith('/ai-drafts')"
              class="absolute top-1/2 -translate-y-1/2 w-1 h-6 rounded-full bg-teal-500"
              :class="$i18n.locale === 'ar' ? 'right-0' : 'left-0'"></div>
          </router-link>

          <!-- Admin Section -->
          <template v-if="isAdmin">
            <div v-if="sidebarOpen" class="pt-4 mt-4 border-t border-slate-700/50">
              <p class="px-3 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                {{ t('nav.administration', 'Administration') }}
              </p>
            </div>
            <div v-else class="pt-2 mt-4 border-t border-slate-700/50 mx-2"></div>

            <!-- Users -->
            <router-link v-if="hasPermission('administration')" to="/admin/users" @click="closeSidebarOnMobile"
              class="flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group relative" :class="[
                !sidebarOpen && !isMobile ? 'justify-center' : '',
                $route.path.includes('/admin/users')
                  ? 'bg-purple-500/10 text-purple-400 border border-purple-500/20 shadow-sm shadow-purple-500/10'
                  : 'text-slate-400 hover:bg-slate-800/60 hover:text-white',
              ]" :title="!sidebarOpen && !isMobile ? t('nav.users') : ''">
              <svg class="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                <path
                  d="M15 9h3.75M15 12h3.75M15 15h3.75M4.5 19.5h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5zm6-10.125a1.875 1.875 0 11-3.75 0 1.875 1.875 0 013.75 0zm1.294 6.336a6.721 6.721 0 01-3.17.789 6.721 6.721 0 01-3.168-.789 3.376 3.376 0 016.338 0z" />
              </svg>
              <span v-if="sidebarOpen" class="text-sm font-medium transition-colors">
                {{ t('nav.users') }}
              </span>
              <div v-if="$route.path.includes('/admin/users')"
                class="absolute top-1/2 -translate-y-1/2 w-1 h-6 rounded-full bg-purple-500"
                :class="$i18n.locale === 'ar' ? 'right-0' : 'left-0'"></div>
            </router-link>

            <!-- Groups -->
            <router-link v-if="hasPermission('administration')" to="/admin/groups" @click="closeSidebarOnMobile"
              class="flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group relative" :class="[
                !sidebarOpen && !isMobile ? 'justify-center' : '',
                $route.path.includes('/admin/groups')
                  ? 'bg-purple-500/10 text-purple-400 border border-purple-500/20 shadow-sm shadow-purple-500/10'
                  : 'text-slate-400 hover:bg-slate-800/60 hover:text-white',
              ]" :title="!sidebarOpen && !isMobile ? t('nav.groups') : ''">
              <svg class="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                <path
                  d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
              </svg>
              <span v-if="sidebarOpen" class="text-sm font-medium transition-colors">
                {{ t('nav.groups') }}
              </span>
              <div v-if="$route.path.includes('/admin/groups')"
                class="absolute top-1/2 -translate-y-1/2 w-1 h-6 rounded-full bg-purple-500"
                :class="$i18n.locale === 'ar' ? 'right-0' : 'left-0'"></div>
            </router-link>

            <!-- Permissions -->
            <router-link v-if="hasPermission('administration')" to="/admin/permissions" @click="closeSidebarOnMobile"
              class="flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group relative" :class="[
                !sidebarOpen && !isMobile ? 'justify-center' : '',
                $route.path.includes('/admin/permissions')
                  ? 'bg-purple-500/10 text-purple-400 border border-purple-500/20 shadow-sm shadow-purple-500/10'
                  : 'text-slate-400 hover:bg-slate-800/60 hover:text-white',
              ]" :title="!sidebarOpen && !isMobile ? t('nav.permissions') : ''">
              <svg class="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                <path
                  d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
              </svg>
              <span v-if="sidebarOpen" class="text-sm font-medium transition-colors">
                {{ t('nav.permissions') }}
              </span>
              <div v-if="$route.path.includes('/admin/permissions')"
                class="absolute top-1/2 -translate-y-1/2 w-1 h-6 rounded-full bg-purple-500"
                :class="$i18n.locale === 'ar' ? 'right-0' : 'left-0'"></div>
            </router-link>

            <!-- Assign Permissions -->
            <router-link v-if="hasPermission('administration')" to="/admin/assign-permissions"
              @click="closeSidebarOnMobile"
              class="flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group relative" :class="[
                !sidebarOpen && !isMobile ? 'justify-center' : '',
                $route.path.includes('/admin/assign-permissions')
                  ? 'bg-purple-500/10 text-purple-400 border border-purple-500/20 shadow-sm shadow-purple-500/10'
                  : 'text-slate-400 hover:bg-slate-800/60 hover:text-white',
              ]" :title="!sidebarOpen && !isMobile ? t('nav.assign_permissions') : ''">
              <svg class="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                <path
                  d="M15.75 8.25a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
              </svg>
              <span v-if="sidebarOpen" class="text-sm font-medium transition-colors">
                {{ t('nav.assign_permissions') }}
              </span>
              <div v-if="$route.path.includes('/admin/assign-permissions')"
                class="absolute top-1/2 -translate-y-1/2 w-1 h-6 rounded-full bg-purple-500"
                :class="$i18n.locale === 'ar' ? 'right-0' : 'left-0'"></div>
            </router-link>

            <div v-if="sidebarOpen" class="pt-4 mt-4 border-t border-slate-700/50"></div>
            <div v-else class="pt-2 mt-2 border-t border-slate-700/50 mx-2"></div>

            <!-- Activity Log -->
            <router-link v-if="hasPermission('administration')" to="/activitylog" @click="closeSidebarOnMobile"
              class="flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group relative" :class="[
                !sidebarOpen && !isMobile ? 'justify-center' : '',
                $route.path === '/activitylog'
                  ? 'bg-orange-500/10 text-orange-400 border border-orange-500/20 shadow-sm shadow-orange-500/10'
                  : 'text-slate-400 hover:bg-slate-800/60 hover:text-white',
              ]" :title="!sidebarOpen && !isMobile ? t('nav.activitylog') : ''">
              <svg class="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                <path d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span v-if="sidebarOpen" class="text-sm font-medium transition-colors">
                {{ t('nav.activitylog') }}
              </span>
              <div v-if="$route.path === '/activitylog'"
                class="absolute top-1/2 -translate-y-1/2 w-1 h-6 rounded-full bg-orange-500"
                :class="$i18n.locale === 'ar' ? 'right-0' : 'left-0'"></div>
            </router-link>

            <!-- OTP Logs -->
            <router-link v-if="hasPermission('view_otp_logs')" to="/admin/otp-logs" @click="closeSidebarOnMobile"
              class="flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group relative" :class="[
                !sidebarOpen && !isMobile ? 'justify-center' : '',
                $route.path === '/admin/otp-logs'
                  ? 'bg-orange-500/10 text-orange-400 border border-orange-500/20 shadow-sm shadow-orange-500/10'
                  : 'text-slate-400 hover:bg-slate-800/60 hover:text-white',
              ]" :title="!sidebarOpen && !isMobile ? t('otpLogs.title') : ''">
              <svg class="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                <path
                  d="M15.75 5.25a3 3 0 013 3m3 0a6 6 0 01-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1121.75 8.25z" />
              </svg>
              <span v-if="sidebarOpen" class="text-sm font-medium transition-colors">
                {{ t('otpLogs.title') }}
              </span>
              <div v-if="$route.path === '/admin/otp-logs'"
                class="absolute top-1/2 -translate-y-1/2 w-1 h-6 rounded-full bg-orange-500"
                :class="$i18n.locale === 'ar' ? 'right-0' : 'left-0'"></div>
            </router-link>

            <!-- My Tickets (كل المستخدمين) -->
            <router-link to="/support/my-tickets" @click="closeSidebarOnMobile"
              class="flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group relative" :class="[
                !sidebarOpen && !isMobile ? 'justify-center' : '',
                $route.path.includes('/support/my-tickets')
                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shadow-sm shadow-emerald-500/10'
                  : 'text-slate-400 hover:bg-slate-800/60 hover:text-white',
              ]" :title="!sidebarOpen && !isMobile ? t('nav.my_tickets') : ''">
              <svg class="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path stroke-linecap="round" stroke-linejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zM2.25 12.76c0 1.6 1.123 2.994 2.707 3.227 1.087.16 2.185.283 3.293.369V21l4.184-4.183a1.14 1.14 0 01.778-.332 48.294 48.294 0 005.83-.498c1.585-.233 2.708-1.626 2.708-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" /></svg>
              <span v-if="sidebarOpen" class="text-sm font-medium transition-colors">
                {{ t('nav.my_tickets') }}
              </span>
              <div v-if="$route.path.includes('/support/my-tickets')"
                class="absolute top-1/2 -translate-y-1/2 w-1 h-6 rounded-full bg-emerald-500"
                :class="$i18n.locale === 'ar' ? 'right-0' : 'left-0'"></div>
            </router-link>

            <!-- Support Tickets -->
            <router-link v-if="hasPermission('administration')" to="/support/tickets" @click="closeSidebarOnMobile"
              class="flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group relative" :class="[
                !sidebarOpen && !isMobile ? 'justify-center' : '',
                $route.path.includes('/support/tickets')
                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shadow-sm shadow-emerald-500/10'
                  : 'text-slate-400 hover:bg-slate-800/60 hover:text-white',
              ]" :title="!sidebarOpen && !isMobile ? t('nav.support_tickets') : ''">
              <svg class="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                <path
                  d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193-.34.027-.68.052-1.02.072v3.091l-3-3c-1.354 0-2.694-.055-4.02-.163a2.115 2.115 0 01-.825-.242m9.345-8.334a2.126 2.126 0 00-.476-.095 48.64 48.64 0 00-8.048 0c-1.131.094-1.976 1.057-1.976 2.192v4.286c0 .837.46 1.58 1.155 1.951m9.345-8.334V6.637c0-1.621-1.152-3.026-2.76-3.235A48.455 48.455 0 0011.25 3c-2.115 0-4.198.137-6.24.402-1.608.209-2.76 1.614-2.76 3.235v6.226c0 1.621 1.152 3.026 2.76 3.235.577.075 1.157.14 1.74.194V21l4.155-4.155" />
              </svg>
              <span v-if="sidebarOpen" class="text-sm font-medium transition-colors">
                {{ t('nav.support_tickets') }}
              </span>
              <div v-if="$route.path.includes('/support/tickets')"
                class="absolute top-1/2 -translate-y-1/2 w-1 h-6 rounded-full bg-emerald-500"
                :class="$i18n.locale === 'ar' ? 'right-0' : 'left-0'"></div>
            </router-link>
          </template>
        </nav>
      </div>
    </aside>

    <!-- Main Content -->
    <div class="flex-1 flex flex-col min-h-screen overflow-hidden relative">
      <!-- Top Navbar -->
      <nav class="bg-white/80 backdrop-blur-md shadow-sm border-b border-gray-200/80 sticky top-0 z-30">
        <div class="px-4 lg:px-6 py-3 flex items-center justify-between">
          <div class="flex items-center gap-3">
            <button v-if="isMobile" @click="toggleSidebar"
              class="p-2.5 rounded-xl bg-blue-900 hover:bg-slate-800 text-white transition-all duration-200 shadow-lg shadow-slate-900/20 hover:shadow-slate-900/30 hover:scale-105 active:scale-95">
              <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"
                stroke-linecap="round" stroke-linejoin="round">
                <path d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
              </svg>
            </button>

            <!-- Breadcrumb -->
            <div class="hidden md:flex items-center text-sm text-gray-500 ml-2">
              <router-link to="/dashboard" class="hover:text-blue-600 transition-colors flex items-center gap-1">
                <svg class="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"
                  stroke-linecap="round" stroke-linejoin="round">
                  <path
                    d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
                </svg>
                <span>{{ t('nav.dashboard') }}</span>
              </router-link>
              <template v-if="$route.path !== '/dashboard'">
                <svg class="w-3 h-3 mx-2 text-gray-300" :class="$i18n.locale === 'ar' ? 'rotate-180' : ''"
                  viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                  stroke-linejoin="round">
                  <path d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                </svg>
                <span class="text-gray-800 font-semibold">{{ pageTitle }}</span>
              </template>
            </div>
          </div>

          <div class="md:hidden">
            <h1 class="text-slate-800 font-bold text-sm">{{ pageTitle }}</h1>
          </div>

          <div class="flex items-center gap-2">
            <BranchSelector v-if="!isMobile" />
            <PropertySelector v-if="!isMobile && hasPermission('view_properties')" />
            <InvoiceNotificationBell v-if="!isMobile" />

            <button @click="handleToggleDarkMode"
              class="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-slate-800 rounded-xl transition-all duration-200"
              :title="darkModeEnabled
                ? t('nav.light_mode', 'Light Mode')
                : t('nav.dark_mode', 'Dark Mode')
                ">
              <svg v-if="darkModeEnabled" class="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                <path
                  d="M12 3v1.5m0 15V21m9-9h-1.5M4.5 12H3m15.364 6.364l-1.06-1.06M6.697 6.697l-1.06-1.06m12.727 0l-1.06 1.06M6.697 17.303l-1.06 1.06M16.5 12a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0z" />
              </svg>
              <svg v-else class="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"
                stroke-linecap="round" stroke-linejoin="round">
                <path
                  d="M21.752 15.002A9.72 9.72 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z" />
              </svg>
            </button>

            <button @click="toggleLanguage"
              class="hidden md:flex items-center gap-2 px-3 py-2 text-sm text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-slate-800 rounded-xl transition-all duration-200">
              <svg class="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"
                stroke-linecap="round" stroke-linejoin="round">
                <path
                  d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418" />
              </svg>
              <span class="font-medium">{{ $i18n.locale === 'ar' ? 'English' : 'العربية' }}</span>
            </button>

            <!-- User Dropdown -->
            <div class="relative" ref="userDropdownRef">
              <button @click="userDropdownOpen = !userDropdownOpen"
                class="flex items-center gap-2.5 p-1.5 pr-3 rounded-xl hover:bg-gray-100 dark:hover:bg-slate-800 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20">
                <div class="relative h-9 w-9 flex-shrink-0">
                  <img v-if="user?.img_url" :src="user.img_url"
                    class="w-full h-full rounded-full object-cover border-2 border-blue-100 shadow-sm"
                    :alt="user?.name" />
                  <div v-else
                    class="w-full h-full rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-xs font-bold shadow-sm">
                    {{ getInitials(user?.name) }}
                  </div>
                </div>
                <div class="hidden md:block text-right">
                  <p class="text-sm font-semibold text-gray-800 dark:text-gray-100 leading-tight">
                    {{ user?.name }}
                  </p>
                  <p class="text-xs text-gray-500 dark:text-gray-400 leading-tight">
                    {{ user?.group?.title_ar || $t('auth.user', 'User') }}
                  </p>
                </div>
                <svg class="w-3 h-3 text-gray-400 hidden md:block transition-transform duration-200"
                  :class="userDropdownOpen ? 'rotate-180' : ''" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                  stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                </svg>
              </button>

              <Transition enter-active-class="transition-all duration-200 ease-out"
                enter-from-class="opacity-0 scale-95 -translate-y-2"
                enter-to-class="opacity-100 scale-100 translate-y-0"
                leave-active-class="transition-all duration-150 ease-in"
                leave-from-class="opacity-100 scale-100 translate-y-0"
                leave-to-class="opacity-0 scale-95 -translate-y-2">
                <div v-if="userDropdownOpen"
                  class="absolute mt-2 w-56 bg-white dark:bg-slate-800 rounded-2xl shadow-xl shadow-gray-200/50 dark:shadow-black/30 border border-gray-100 dark:border-slate-700 z-50 overflow-hidden"
                  :class="$i18n.locale === 'ar' ? 'left-0' : 'right-0'">
                  <div class="p-4 border-b border-gray-100 dark:border-slate-700 bg-gray-50/50 dark:bg-slate-900/50">
                    <div class="flex items-center gap-3">
                      <div class="relative h-12 w-12 flex-shrink-0">
                        <img v-if="user?.img_url" :src="user.img_url"
                          class="w-full h-full rounded-full object-cover border-2 border-blue-100" :alt="user?.name" />
                        <div v-else
                          class="w-full h-full rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-sm">
                          {{ getInitials(user?.name) }}
                        </div>
                      </div>
                      <div class="flex-1 min-w-0">
                        <p class="font-semibold text-gray-900 dark:text-gray-100 truncate">
                          {{ user?.name }}
                        </p>
                        <p class="text-xs text-gray-500 dark:text-gray-400 truncate">
                          {{ user?.email }}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div class="py-1.5">
                    <!-- Profile -->
                    <router-link to="/profile"
                      class="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-200 hover:bg-blue-50 dark:hover:bg-slate-700 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                      @click="userDropdownOpen = false">
                      <div class="w-8 h-8 rounded-lg bg-blue-50 dark:bg-slate-700 flex items-center justify-center">
                        <svg class="w-5 h-5 text-blue-500" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                          stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                          <path
                            d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                      </div>
                      <span class="font-medium">{{ $t('nav.profile', 'Profile') }}</span>
                    </router-link>
                    <!-- Logout -->
                    <button @click="logout"
                      class="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors">
                      <div class="w-8 h-8 rounded-lg bg-red-50 dark:bg-red-500/10 flex items-center justify-center">
                        <svg class="w-5 h-5 text-red-500" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                          stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                          <path
                            d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
                        </svg>
                      </div>
                      <span class="font-medium">{{ $t('auth.logout', 'Logout') }}</span>
                    </button>
                  </div>
                </div>
              </Transition>
            </div>
          </div>
        </div>
      </nav>

      <!-- Page Content -->
      <FloatingSupportButton />
      <main class="flex-1 p-4 md:p-6 lg:p-8 bg-gray-50/50">
        <router-view v-slot="{ Component }">
          <Transition name="page" mode="out-in">
            <component :is="Component" :key="`${$route.fullPath}-${selectedBranchId}`" />
          </Transition>
        </router-view>
      </main>

      <!-- Footer -->
      <Footer />
    </div>
  </div>
</template>

<script>
import FloatingSupportButton from '@/components/shared/FloatingSupportButton.vue'
import InvoiceNotificationBell from '@/components/shared/InvoiceNotificationBell.vue'
import BranchSelector from '@/views/BranchSelector.vue'
import PropertySelector from '@/components/shared/PropertySelector.vue'
import Footer from './Footer.vue'
import { toggleDarkMode, isDarkMode } from '@/utils/darkMode'

export default {
  name: 'DefaultLayout',
  components: { FloatingSupportButton, InvoiceNotificationBell, BranchSelector, PropertySelector, Footer },
  props: {
    enableI18n: { type: Boolean, default: true },
  },
  data() {
    return {
      sidebarOpen: true,
      userDropdownOpen: false,
      isMobile: false,
      darkModeEnabled: false,
    }
  },
  computed: {
    user() {
      return this.$store.state.auth?.user
    },
    permissions() {
      return this.$store.state.auth?.permissions || []
    },
    isAdmin() {
      return this.$store.state.auth?.is_admin || false
    },
    selectedBranchId() {
      return this.$store.state.branch?.selectedBranchId
    },
    // ── عناصر قسم العقارات في السايدبار (حسب الصلاحيات) ──
    propertyNavItems() {
      const items = [
        { to: '/properties', label: 'nav.properties', perm: 'view_properties', icon: 'M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6H15m-1.5 3H15m-1.5 3H15M9 21v-3.375c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125V21' },
        { to: '/floors', label: 'nav.floors', perm: 'view_floors', icon: 'M6.429 9.75L2.25 12l4.179 2.25m0-4.5l5.571 3 5.571-3m-11.142 0L2.25 7.5 12 2.25l9.75 5.25-4.179 2.25m0 0L21.75 12l-4.179 2.25m0 0l4.179 2.25L12 21.75 2.25 16.5l4.179-2.25m11.142 0l-5.571 3-5.571-3' },
        { to: '/units', label: 'nav.units', perm: 'view_units', icon: 'M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z' },
        { to: '/tenants', label: 'nav.tenants', perm: 'view_tenants', icon: 'M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z' },
        { to: '/contracts', label: 'realty.contract.title', perm: 'view_contracts', icon: 'M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z' },
      ]
      return items.filter((item) => this.hasPermission(item.perm))
    },
    pageTitle() {
      const path = this.$route.path
      const routeMap = {
        '/dashboard': 'nav.dashboard',
        '/invoices': 'nav.invoices',
        '/clients': 'nav.clients',
        '/properties': 'nav.properties',
        '/floors': 'nav.floors',
        '/units': 'nav.units',
        '/tenants': 'nav.tenants',
        '/ai-drafts': 'nav.ai_drafts',
        '/contracts': 'realty.contract.title',
        '/reports': 'nav.reports',
        '/users': 'nav.users',
        '/permissions': 'nav.permissions',
        '/profile': 'nav.profile',
        '/activitylog': 'nav.activitylog',
        '/admin/users': 'nav.users',
        '/admin/groups': 'nav.groups',
        '/admin/permissions': 'nav.permissions',
        '/admin/assign-permissions': 'nav.assign_permissions',
        '/admin/otp-logs': 'otpLogs.title',
      }
      const key = routeMap[path] || 'nav.dashboard'
      return this.t(key, path.replace('/', ''))
    },
  },
  methods: {
    t(key, fallback = '') {
      if (!this.enableI18n) {
        const staticTexts = {
          'app.name': 'System',
          'auth.user': 'User',
          'auth.logout': 'Logout',
          'nav.profile': 'Profile',
          'nav.dashboard': 'Dashboard',
          'nav.clients': 'Clients',
          'nav.invoices': 'Invoices',
          'nav.reports': 'Reports',
          'nav.users': 'Users',
          'nav.groups': 'Groups',
          'nav.permissions': 'Permissions',
          'nav.assign_permissions': 'Assign Permissions',
          'nav.activitylog': 'Activity Log',
          'nav.toggle_language': 'Toggle Language',
          'nav.administration': 'Administration',
          'nav.dark_mode': 'Dark Mode',
          'nav.light_mode': 'Light Mode',
        }
        return staticTexts[key] || fallback || key
      }
      return this.$t(key, fallback)
    },
    getInitials(name) {
      if (!name) return 'U'
      const words = name.trim().split(/\s+/)
      if (words.length === 1) return words[0].substring(0, 2).toUpperCase()
      return (words[0][0] + words[words.length - 1][0]).toUpperCase()
    },
    hasPermission(permission) {
      if (this.isAdmin) return true
      return this.permissions.includes(permission)
    },
    toggleSidebar() {
      this.sidebarOpen = !this.sidebarOpen
      if (this.isMobile) {
        document.body.style.overflow = this.sidebarOpen ? 'hidden' : ''
      }
    },
    closeSidebarOnMobile() {
      if (this.isMobile) {
        this.sidebarOpen = false
        document.body.style.overflow = ''
      }
    },
    toggleLanguage() {
      const newLang = this.$i18n.locale === 'ar' ? 'en' : 'ar'
      this.$i18n.locale = newLang
      localStorage.setItem('userLanguage', newLang)
      window.location.reload()
    },
    handleToggleDarkMode() {
      this.darkModeEnabled = toggleDarkMode()
    },
    async logout() {
      try {
        await this.$store.dispatch('auth/logout')
        this.$router.push('/login')
      } catch (error) {
        console.error('Logout error:', error)
      }
    },
    checkMobile() {
      const wasMobile = this.isMobile
      this.isMobile = window.innerWidth < 768
      if (this.isMobile && !wasMobile) {
        this.sidebarOpen = false
      } else if (!this.isMobile && wasMobile) {
        this.sidebarOpen = true
      }
    },
    handleClickOutside(event) {
      if (this.$refs.userDropdownRef && !this.$refs.userDropdownRef.contains(event.target)) {
        this.userDropdownOpen = false
      }
    },
  },
  mounted() {
    this.checkMobile()
    window.addEventListener('resize', this.checkMobile)
    document.addEventListener('click', this.handleClickOutside)

    this.darkModeEnabled = isDarkMode()

    if (!this.user) this.$store.dispatch('auth/checkAuth')
    this.$store.dispatch('invoiceNotifications/startListening')
  },
  beforeUnmount() {
    window.removeEventListener('resize', this.checkMobile)
    document.removeEventListener('click', this.handleClickOutside)
    this.$store.dispatch('invoiceNotifications/stopListening')
    document.body.style.overflow = ''
  },
}
</script>

<style scoped>
/* Custom Scrollbar */
.custom-scrollbar::-webkit-scrollbar {
  width: 5px;
}

.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 10px;
}

.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.2);
}

/* Fade Transition */
.fade-enter-active,
.fade-leave-active {
  transition:
    opacity 0.2s ease,
    transform 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateX(-5px);
}

/* Page Transition */
.page-enter-active,
.page-leave-active {
  transition:
    opacity 0.2s ease,
    transform 0.2s ease;
}

.page-enter-from {
  opacity: 0;
  transform: translateY(10px);
}

.page-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

/* RTL Support */
[dir='rtl'] .fade-enter-from,
[dir='rtl'] .fade-leave-to {
  transform: translateX(5px);
}

/* Smooth scrollbar for the whole page */
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-track {
  background: #f1f5f9;
}

::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}

.fade-slide-enter-active,
.fade-slide-leave-active {
  transition:
    opacity 0.25s ease,
    transform 0.25s ease;
}

.fade-slide-enter-from,
.fade-slide-leave-to {
  opacity: 0;
  transform: translateX(-6px);
}

[dir='rtl'] .fade-slide-enter-from,
[dir='rtl'] .fade-slide-leave-to {
  transform: translateX(6px);
}
</style>

<style>
.page-fade-enter-active,
.page-fade-leave-active {
  transition:
    opacity 0.2s ease,
    transform 0.2s ease;
}

.page-fade-enter-from {
  opacity: 0;
  transform: translateY(8px);
}

.page-fade-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}

@media (max-width: 767px) {
  main table:not(.table-container table) {
    display: block;
    overflow-x: auto;
    white-space: nowrap;
    -webkit-overflow-scrolling: touch;
  }
}
</style>
