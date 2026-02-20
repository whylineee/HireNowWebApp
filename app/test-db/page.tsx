import { createClient } from '@/utils/supabase/server'
import { Container, Typography, Card, CardContent, Box } from '@mui/material'

export default async function TestDbPage() {
    const supabase = await createClient()

    // Fetch jobs from the database
    const { data: jobs, error } = await supabase.from('jobs').select('*')

    if (error) {
        return (
            <Container maxWidth="md" sx={{ py: 8 }}>
                <Typography variant="h4" color="error" gutterBottom>
                    Помилка підключення до бази даних
                </Typography>
                <Typography variant="body1">{error.message}</Typography>
            </Container>
        )
    }

    return (
        <Container maxWidth="md" sx={{ py: 8 }}>
            <Typography variant="h3" fontWeight={700} gutterBottom>
                Тест Підключення до Supabase
            </Typography>

            <Typography variant="body1" color="text.secondary" paragraph>
                Якщо ви бачите цей текст без помилок, підключення працює! Нижче список вакансій з бази:
            </Typography>

            {jobs && jobs.length > 0 ? (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    {jobs.map((job) => (
                        <Card key={job.id} sx={{ borderRadius: 2 }}>
                            <CardContent>
                                <Typography variant="h5" fontWeight={600} gutterBottom>
                                    {job.title}
                                </Typography>
                                <Typography variant="body2" color="text.secondary" paragraph>
                                    {job.description}
                                </Typography>
                                <Box sx={{ display: 'flex', gap: 2 }}>
                                    <Typography variant="subtitle2" color="primary">
                                        💰 {job.salary}
                                    </Typography>
                                    <Typography variant="subtitle2" color="text.secondary">
                                        📍 {job.location}
                                    </Typography>
                                </Box>
                            </CardContent>
                        </Card>
                    ))}
                </Box>
            ) : (
                <Card sx={{ p: 4, textAlign: 'center', bgcolor: 'background.default', borderRadius: 2 }}>
                    <Typography variant="h6" color="text.secondary">
                        Таблиця `jobs` порожня, але підключення успішне! 🎉
                    </Typography>
                </Card>
            )}
        </Container>
    )
}
