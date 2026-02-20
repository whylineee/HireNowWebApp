import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
const supabase = createClient(supabaseUrl, supabaseKey)

async function test() {
    // Let's sign in as the user
    const { data: { session }, error: signInError } = await supabase.auth.signInWithPassword({
        email: 'msaviin90@icloud.com', // wait I don't know passwords.
        password: 'password' // so I'll just check RLS directly with pg
    })
}
test()
