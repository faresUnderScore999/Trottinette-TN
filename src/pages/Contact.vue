<template>
  <div class="min-h-screen bg-slate-50/50 py-12">
    <div class="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
      <div class="mb-10 text-center">
        <h1 class="text-4xl font-extrabold tracking-tight text-slate-900">📬 Get In Touch</h1>
        <p class="mt-2 text-base text-slate-500">
          We'd love to hear from you. Visit us or reach out anytime.
        </p>
      </div>

      <div class="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <!-- Contact Cards -->
        <div class="lg:col-span-1 space-y-4">
          <!-- Address Card -->
          <div
            class="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm shadow-slate-200/40 transition hover:shadow-md hover:-translate-y-0.5"
          >
            <div class="flex items-center gap-3 mb-3">
              <div
                class="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600"
              >
                <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
              </div>
              <h3 class="text-sm font-bold text-slate-900 uppercase tracking-wide">Address</h3>
            </div>
            <p class="text-sm text-slate-600 leading-relaxed">
              54 Av. Jean Jaurès<br />Tunis le Passage<br />Tunis, Tunisia
            </p>
          </div>

          <!-- Phone Card -->
          <div
            class="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm shadow-slate-200/40 transition hover:shadow-md hover:-translate-y-0.5"
          >
            <div class="flex items-center gap-3 mb-3">
              <div
                class="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600"
              >
                <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                  />
                </svg>
              </div>
              <h3 class="text-sm font-bold text-slate-900 uppercase tracking-wide">Phone</h3>
            </div>
            <a
              href="tel:+21697388633"
              class="text-sm text-slate-600 hover:text-blue-600 transition font-medium"
              >+216 97 388 633</a
            >
          </div>

          <!-- Facebook Card -->
          <div
            class="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm shadow-slate-200/40 transition hover:shadow-md hover:-translate-y-0.5"
          >
            <div class="flex items-center gap-3 mb-3">
              <div
                class="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600"
              >
                <svg class="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path
                    d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"
                  />
                </svg>
              </div>
              <h3 class="text-sm font-bold text-slate-900 uppercase tracking-wide">Facebook</h3>
            </div>
            <a
              href="https://www.facebook.com/profile.php?id=61551044490591"
              target="_blank"
              rel="noopener noreferrer"
              class="text-sm text-slate-600 hover:text-blue-600 transition font-medium"
              >Follow us on Facebook</a
            >
          </div>

          <!-- Hours Card -->
          <div
            class="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm shadow-slate-200/40 transition hover:shadow-md hover:-translate-y-0.5"
          >
            <div class="flex items-center gap-3 mb-3">
              <div
                class="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-amber-600"
              >
                <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 class="text-sm font-bold text-slate-900 uppercase tracking-wide">Hours</h3>
            </div>
            <p class="text-sm text-slate-600">Mon - Fri: 9:00 - 18:00</p>
            <p class="text-sm text-slate-600">Sat: 9:00 - 14:00</p>
          </div>
        </div>

        <!-- Map Section -->
        <div
          class="lg:col-span-2 rounded-2xl border border-slate-200 bg-white shadow-lg shadow-slate-200/40 overflow-hidden"
        >
          <div class="p-3">
            <img
              src="/yadea.jpg"
              alt="Location map"
              class="w-full h-72 sm:h-80 lg:h-[450px] object-cover rounded-xl"
              @error="onImageError"
            />
          </div>
          <div class="px-6 pb-5 pt-1">
            <p class="text-sm text-slate-500 text-center font-medium">
              Located in the heart of Tunis, Passage Jean Jaurès
            </p>
          </div>
        </div>
      </div>

      <!-- CTA Banner -->
      <div
        class="mt-8 rounded-2xl bg-gradient-to-r from-slate-900 to-blue-900 p-8 text-center shadow-xl"
      >
        <h2 class="text-2xl font-bold text-white mb-2">Ready to visit us?</h2>
        <p class="text-blue-200 mb-4">
          Stop by our showroom or give us a call to schedule a visit.
        </p>
        <div class="flex flex-col sm:flex-row gap-3 justify-center">
          <a
            href="tel:+21697388633"
            class="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-5 py-2.5 text-sm font-semibold text-slate-900 shadow-md transition hover:bg-blue-50"
          >
            <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
              />
            </svg>
            Call Now
          </a>
          <a
            href="https://www.facebook.com/profile.php?id=61551044490591"
            target="_blank"
            rel="noopener noreferrer"
            class="inline-flex items-center justify-center gap-2 rounded-xl border-2 border-white/30 bg-white/10 px-5 py-2.5 text-sm font-semibold text-white backdrop-blur-sm transition hover:bg-white/20"
          >
            <svg class="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
              <path
                d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"
              />
            </svg>
            Facebook Page
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const onImageError = (e) => {
  e.target.src =
    'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="544" height="250" viewBox="0 0 544 250"><rect fill="%23f1f5f9" width="544" height="250"/><text fill="%2394a3b8" font-family="sans-serif" font-size="14" x="50%" y="50%" dominant-baseline="middle" text-anchor="middle">Carte non disponible</text></svg>'
}
</script>
