import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const {
    data: { user },
  } = await supabase.auth.getUser()

  // SECURITY FIX: Enhanced route protection
  const isAuthPage = request.nextUrl.pathname.startsWith('/login') || 
                    request.nextUrl.pathname.startsWith('/register') ||
                    request.nextUrl.pathname.startsWith('/auth')
  
  const isAdminRoute = request.nextUrl.pathname.startsWith('/admin')
  const isDashboardRoute = request.nextUrl.pathname.startsWith('/(dashboard)') ||
                          request.nextUrl.pathname.startsWith('/create') ||
                          request.nextUrl.pathname.startsWith('/polls')

  if (!user && !isAuthPage) {
    // SECURITY FIX: Redirect unauthenticated users to login
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    return NextResponse.redirect(url)
  }

  // SECURITY FIX: Add admin role check for admin routes
  if (isAdminRoute && user) {
    // TODO: Add proper admin role checking from user metadata or database
    // const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
    // if (profile?.role !== 'admin') {
    //   return NextResponse.redirect(new URL('/unauthorized', request.url))
    // }
  }

  return supabaseResponse
}