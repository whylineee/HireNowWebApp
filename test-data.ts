import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ''
const supabase = createClient(supabaseUrl, supabaseKey)

async function test() {
    console.log("Testing join query...");
    const { data, error } = await supabase.from('applications')
        .select('*, profile:profiles!applicant_id(full_name, location, skills), job:jobs!job_id(title, company)')

    console.log("Data:", JSON.stringify(data, null, 2))
    if (error) console.error("Error:", error)
}
test()
