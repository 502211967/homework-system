// config.js - 支持Vercel环境变量
const getSupabaseConfig = () => {
    // 在Vercel环境中可以使用process.env，静态环境中使用固定值
    if (typeof process !== 'undefined' && process.env) {
        return {
            URL: process.env.SUPABASE_URL || 'https://your-project.supabase.co',
            KEY: process.env.SUPABASE_KEY || 'your-anon-key'
        };
    }
    
    // 开发环境使用固定值（记得替换为你的实际值）
    return {
        URL: 'https://your-project.supabase.co',
        KEY: 'your-anon-key-here'
    };
};

const SUPABASE_CONFIG = getSupabaseConfig();

// 初始化Supabase客户端
const supabase = window.supabase.createClient(
    SUPABASE_CONFIG.URL, 
    SUPABASE_CONFIG.KEY
);

// 测试连接
async function testConnection() {
    try {
        const { data, error } = await supabase
            .from('students')
            .select('count')
            .limit(1);
            
        if (error) {
            console.error('❌ 数据库连接失败:', error);
            return false;
        } else {
            console.log('✅ 数据库连接成功');
            return true;
        }
    } catch (err) {
        console.error('❌ 连接测试异常:', err);
        return false;
    }
}

// 通用的数据库操作函数
const db = {
    // 获取所有学生
    async getStudents() {
        const { data, error } = await supabase
            .from('students')
            .select('*')
            .order('name');
        
        if (error) {
            console.error('获取学生数据失败:', error);
            throw error;
        }
        return data || [];
    },

    // 添加新学生
    async addStudent(studentData) {
        const { data, error } = await supabase
            .from('students')
            .insert([{
                name: studentData.name,
                grade: studentData.grade,
                class: studentData.class,
                student_number: studentData.studentNumber
            }])
            .select();
        
        if (error) throw error;
        return data[0];
    },

    // 获取作业列表
    async getHomework() {
        const { data, error } = await supabase
            .from('homework')
            .select(`
                *,
                students (name, grade, class),
                subjects (subject_name)
            `)
            .order('created_at', { ascending: false });
        
        if (error) throw error;
        return data || [];
    },

    // 添加作业
    async addHomework(homeworkData) {
        const { data, error } = await supabase
            .from('homework')
            .insert([{
                student_id: homeworkData.studentId,
                subject_id: homeworkData.subjectId,
                title: homeworkData.title,
                description: homeworkData.description,
                total_score: homeworkData.totalScore
            }])
            .select();
        
        if (error) throw error;
        return data[0];
    },

    // 添加批改记录
    async addCorrection(correctionData) {
        const { data, error } = await supabase
            .from('corrections')
            .insert([{
                homework_id: correctionData.homeworkId,
                question_number: correctionData.questionNumber,
                score: correctionData.score,
                full_score: correctionData.fullScore,
                teacher_notes: correctionData.teacherNotes,
                ai_feedback: correctionData.aiFeedback,
                correction_marks: correctionData.correctionMarks || []
            }])
            .select();
        
        if (error) throw error;
        return data[0];
    },

    // 获取学情分析
    async getStudentAnalysis(studentId) {
        const { data, error } = await supabase
            .from('student_analysis')
            .select('*')
            .eq('student_id', studentId)
            .order('analysis_date', { ascending: false })
            .limit(10);
        
        if (error) throw error;
        return data || [];
    }
};

// 页面加载时测试连接
document.addEventListener('DOMContentLoaded', function() {
    // 延迟测试，确保Supabase已加载
    setTimeout(() => {
        testConnection().then(success => {
            if (success) {
                // 连接成功，可以初始化页面数据
                initializePageData();
            }
        });
    }, 1000);
});

async function initializePageData() {
    // 根据当前页面初始化数据
    const path = window.location.pathname;
    
    if (path.includes('analysis.html')) {
        await loadAnalysisData();
    } else if (path.includes('homework.html')) {
        await loadHomeworkData();
    }
}