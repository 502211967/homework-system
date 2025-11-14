// 配置Supabase（替换为你的实际URL和key）
const SUPABASE_URL = 'https://xhtgizwupwwyxpblkirp.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhodGdpend1cHd3eXhwYmxraXJwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI5MjU2MjIsImV4cCI6MjA3ODUwMTYyMn0.i676N_cmnzaDJoPGEzgR4kCJz9XIkAcjnadHc5VgHpU';

const supabase = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

// 测试连接
async function testConnection() {
    const { data, error } = await supabase.from('students').select('*');
    if (error) {
        console.error('数据库连接失败:', error);
    } else {
        console.log('数据库连接成功:', data);
    }
}