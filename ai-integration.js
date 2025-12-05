// ============================================
// DataHub ВУЗ РК — AI Integration Module
// Real AI-powered university recommendation system
// ============================================

// AI Configuration
const AI_CONFIG = {
    endpoint: 'https://api.anthropic.com/v1/messages',
    model: 'claude-sonnet-4-20250514',
    maxTokens: 1024
};

// University Database
const UNIVERSITIES_DB = [
    {
        id: 'kaznu',
        name: 'Әл-Фараби атындағы ҚазҰУ',
        city: 'Алматы',
        type: 'Классикалық',
        programs: ['IT', 'Медицина', 'Құқық', 'Экономика', 'Филология', 'Физика', 'Химия', 'Биология'],
        rating: 4.8,
        tuition: 800000,
        grant: true,
        international: true,
        dormitory: true,
        employment_rate: 85,
        avg_salary: 350000
    },
    {
        id: 'nu',
        name: 'Назарбаев Университеті',
        city: 'Астана',
        type: 'Зерттеу',
        programs: ['Engineering', 'Computer Science', 'Medicine', 'Business', 'Law', 'Sciences'],
        rating: 4.9,
        tuition: 0,
        grant: true,
        international: true,
        dormitory: true,
        employment_rate: 95,
        avg_salary: 800000
    },
    {
        id: 'satbayev',
        name: 'Satbayev University',
        city: 'Алматы',
        type: 'Техникалық',
        programs: ['IT', 'Мұнай-газ', 'Геология', 'Машина жасау', 'Энергетика', 'Архитектура'],
        rating: 4.7,
        tuition: 900000,
        grant: true,
        international: true,
        dormitory: true,
        employment_rate: 88,
        avg_salary: 450000
    },
    {
        id: 'kimep',
        name: 'КИМЭП Университеті',
        city: 'Алматы',
        type: 'Бизнес',
        programs: ['MBA', 'Қаржы', 'Құқық', 'Маркетинг', 'Менеджмент', 'Экономика'],
        rating: 4.6,
        tuition: 2500000,
        grant: false,
        international: true,
        dormitory: false,
        employment_rate: 92,
        avg_salary: 600000
    },
    {
        id: 'kazmed',
        name: 'ҚазҰМУ',
        city: 'Алматы',
        type: 'Медициналық',
        programs: ['Жалпы медицина', 'Стоматология', 'Фармация', 'Қоғамдық денсаулық'],
        rating: 4.5,
        tuition: 1200000,
        grant: true,
        international: true,
        dormitory: true,
        employment_rate: 90,
        avg_salary: 400000
    },
    {
        id: 'enu',
        name: 'Л.Н. Гумилев атындағы ЕНУ',
        city: 'Астана',
        type: 'Классикалық',
        programs: ['IT', 'Құқық', 'Экономика', 'Филология', 'Тарих', 'Педагогика'],
        rating: 4.4,
        tuition: 700000,
        grant: true,
        international: true,
        dormitory: true,
        employment_rate: 82,
        avg_salary: 300000
    }
];

// Career paths and salary data
const CAREER_DATA = {
    'IT': { avgSalary: 650000, demand: 'Өте жоғары', growth: '+25%' },
    'Computer Science': { avgSalary: 800000, demand: 'Өте жоғары', growth: '+30%' },
    'Engineering': { avgSalary: 500000, demand: 'Жоғары', growth: '+15%' },
    'Medicine': { avgSalary: 450000, demand: 'Жоғары', growth: '+10%' },
    'Медицина': { avgSalary: 450000, demand: 'Жоғары', growth: '+10%' },
    'Business': { avgSalary: 550000, demand: 'Орташа', growth: '+8%' },
    'MBA': { avgSalary: 900000, demand: 'Жоғары', growth: '+12%' },
    'Құқық': { avgSalary: 400000, demand: 'Орташа', growth: '+5%' },
    'Law': { avgSalary: 400000, demand: 'Орташа', growth: '+5%' },
    'Экономика': { avgSalary: 350000, demand: 'Орташа', growth: '+3%' },
    'Филология': { avgSalary: 250000, demand: 'Төмен', growth: '+2%' }
};

// ============================================
// AI Chat Class
// ============================================
class AIAdvisor {
    constructor() {
        this.conversationHistory = [];
        this.userProfile = {
            interests: [],
            grades: null,
            budget: null,
            city: null,
            priorities: []
        };
    }

    // Main recommendation function
    async getRecommendation(userMessage) {
        // Add user message to history
        this.conversationHistory.push({
            role: 'user',
            content: userMessage
        });

        // Build context for AI
        const systemPrompt = this.buildSystemPrompt();
        
        try {
            // Call Claude API
            const response = await this.callClaudeAPI(systemPrompt, this.conversationHistory);
            
            // Add assistant response to history
            this.conversationHistory.push({
                role: 'assistant',
                content: response
            });
            
            return response;
        } catch (error) {
            console.error('AI API Error:', error);
            return this.getFallbackResponse(userMessage);
        }
    }

    buildSystemPrompt() {
        return `Сен DataHub ВУЗ РК платформасының AI кеңесшісісің. Сенің міндетің - абитуриенттерге Қазақстан университеттерін таңдауға көмектесу.

КОНТЕКСТ:
Университеттер базасы: ${JSON.stringify(UNIVERSITIES_DB, null, 2)}

Мансап деректері: ${JSON.stringify(CAREER_DATA, null, 2)}

НҰСҚАУЛАР:
1. Қазақ және орыс тілдерінде сөйлей аласың
2. Абитуриенттің қызығушылықтары, бағалары, бюджеті туралы сұра
3. Нақты университеттер мен бағдарламаларды ұсын
4. Мансап болашағы мен жалақы деңгейі туралы ақпарат бер
5. Жауаптарың қысқа және нақты болсын (3-4 сөйлем)
6. Сәйкестік пайызын көрсет (мысалы: "95% сәйкестік")

ФОРМАТ:
- Ұсыныстарды нөмірлеп жаз
- Әр ұсынысқа себеп көрсет
- Жалақы мен жұмысқа орналасу статистикасын қос`;
    }

    async callClaudeAPI(systemPrompt, messages) {
        const response = await fetch(AI_CONFIG.endpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: AI_CONFIG.model,
                max_tokens: AI_CONFIG.maxTokens,
                system: systemPrompt,
                messages: messages
            })
        });

        if (!response.ok) {
            throw new Error(`API Error: ${response.status}`);
        }

        const data = await response.json();
        return data.content[0].text;
    }

    // Fallback response using local logic
    getFallbackResponse(userMessage) {
        const lower = userMessage.toLowerCase();
        
        // Analyze user interests
        const analysis = this.analyzeUserInput(lower);
        
        // Get matching universities
        const matches = this.findMatchingUniversities(analysis);
        
        // Generate response
        return this.generateRecommendationText(matches, analysis);
    }

    analyzeUserInput(text) {
        const interests = {
            it: text.includes('информатика') || text.includes('it') || text.includes('программ') || text.includes('компьютер'),
            medicine: text.includes('медицина') || text.includes('дәрігер') || text.includes('биолог'),
            business: text.includes('бизнес') || text.includes('экономика') || text.includes('қаржы') || text.includes('менеджмент'),
            law: text.includes('құқық') || text.includes('заң') || text.includes('юрист'),
            engineering: text.includes('инженер') || text.includes('техник') || text.includes('мұнай'),
            humanities: text.includes('тарих') || text.includes('филолог') || text.includes('тіл')
        };

        const priorities = {
            grant: text.includes('грант') || text.includes('тегін'),
            salary: text.includes('жалақы') || text.includes('ақша') || text.includes('табыс'),
            international: text.includes('шетел') || text.includes('халықаралық') || text.includes('exchange'),
            almaty: text.includes('алматы'),
            astana: text.includes('астана') || text.includes('нұр-сұлтан')
        };

        return { interests, priorities };
    }

    findMatchingUniversities(analysis) {
        let matches = [];

        UNIVERSITIES_DB.forEach(uni => {
            let score = 0;
            let reasons = [];

            // Check interests match
            if (analysis.interests.it && (uni.programs.includes('IT') || uni.programs.includes('Computer Science'))) {
                score += 30;
                reasons.push('IT бағдарламасы бар');
            }
            if (analysis.interests.medicine && (uni.programs.includes('Медицина') || uni.programs.includes('Medicine') || uni.type === 'Медициналық')) {
                score += 30;
                reasons.push('Медицина мамандығы бар');
            }
            if (analysis.interests.business && (uni.programs.includes('Business') || uni.programs.includes('MBA') || uni.type === 'Бизнес')) {
                score += 30;
                reasons.push('Бизнес бағыты бар');
            }
            if (analysis.interests.engineering && uni.type === 'Техникалық') {
                score += 30;
                reasons.push('Техникалық университет');
            }

            // Check priorities
            if (analysis.priorities.grant && uni.grant) {
                score += 20;
                reasons.push('Грант мүмкіндігі');
            }
            if (analysis.priorities.international && uni.international) {
                score += 15;
                reasons.push('Халықаралық бағдарламалар');
            }
            if (analysis.priorities.almaty && uni.city === 'Алматы') {
                score += 10;
                reasons.push('Алматыда орналасқан');
            }
            if (analysis.priorities.astana && uni.city === 'Астана') {
                score += 10;
                reasons.push('Астанада орналасқан');
            }

            // Add rating bonus
            score += uni.rating * 5;

            if (score > 0) {
                matches.push({
                    university: uni,
                    score: Math.min(score, 99),
                    reasons: reasons
                });
            }
        });

        // Sort by score
        matches.sort((a, b) => b.score - a.score);
        return matches.slice(0, 3);
    }

    generateRecommendationText(matches, analysis) {
        if (matches.length === 0) {
            return 'Қызығушылықтарыңыз туралы көбірек айтып берсеңіз, дәлірек ұсыныс бере аламын. Қандай пәндер ұнайды? Қай қалада оқығыңыз келеді?';
        }

        let response = 'Сізге арналған ұсыныстарым:\n\n';

        matches.forEach((match, index) => {
            const uni = match.university;
            const career = CAREER_DATA[uni.programs[0]] || { avgSalary: 350000, demand: 'Орташа' };
            
            response += `${index + 1}. **${uni.name}** — ${match.score}% сәйкестік\n`;
            response += `   📍 ${uni.city} | ⭐ ${uni.rating}\n`;
            response += `   💰 ${uni.tuition === 0 ? 'Тегін (грант)' : uni.tuition.toLocaleString() + ' ₸/жыл'}\n`;
            response += `   📊 Орташа жалақы: ${career.avgSalary.toLocaleString()} ₸/ай\n`;
            response += `   ✅ ${match.reasons.join(', ')}\n\n`;
        });

        response += 'Қосымша сұрақтарыңыз бар ма?';
        return response;
    }

    // Quiz functionality
    processQuizAnswer(question, answer) {
        switch(question) {
            case 'subjects':
                this.userProfile.interests = answer;
                break;
            case 'city':
                this.userProfile.city = answer;
                break;
            case 'budget':
                this.userProfile.budget = answer;
                break;
            case 'priority':
                this.userProfile.priorities = answer;
                break;
        }
    }

    getQuizResult() {
        const analysis = {
            interests: {
                it: this.userProfile.interests.includes('Математика') || this.userProfile.interests.includes('Информатика'),
                medicine: this.userProfile.interests.includes('Биология') || this.userProfile.interests.includes('Химия'),
                business: this.userProfile.interests.includes('Экономика'),
                humanities: this.userProfile.interests.includes('Тарих') || this.userProfile.interests.includes('Тілдер')
            },
            priorities: {
                grant: this.userProfile.budget === 'grant',
                almaty: this.userProfile.city === 'Алматы',
                astana: this.userProfile.city === 'Астана'
            }
        };

        return this.findMatchingUniversities(analysis);
    }
}

// ============================================
// Initialize AI Advisor
// ============================================
const aiAdvisor = new AIAdvisor();

// Export for use in main script
window.aiAdvisor = aiAdvisor;

// Enhanced chat functionality
document.addEventListener('DOMContentLoaded', function() {
    const chatInput = document.querySelector('.chat-input input');
    const chatSendBtn = document.querySelector('.chat-input button');
    const chatMessages = document.querySelector('.chat-messages');

    if (chatSendBtn && chatInput) {
        chatSendBtn.addEventListener('click', handleChatSubmit);
        chatInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') handleChatSubmit();
        });
    }

    async function handleChatSubmit() {
        const message = chatInput.value.trim();
        if (!message) return;

        // Add user message
        addMessage(message, 'user');
        chatInput.value = '';

        // Show typing indicator
        const typingId = showTypingIndicator();

        try {
            // Get AI response
            const response = await aiAdvisor.getRecommendation(message);
            
            // Remove typing indicator
            removeTypingIndicator(typingId);
            
            // Add bot response
            addMessage(response, 'bot');
        } catch (error) {
            removeTypingIndicator(typingId);
            addMessage('Кешіріңіз, қате орын алды. Қайта көріңіз.', 'bot');
        }
    }

    function addMessage(text, type) {
        const msg = document.createElement('div');
        msg.className = `message ${type}`;
        
        // Parse markdown-like formatting
        const formattedText = text
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/\n/g, '<br>');
        
        msg.innerHTML = `<p>${formattedText}</p>`;
        chatMessages.appendChild(msg);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    function showTypingIndicator() {
        const id = 'typing-' + Date.now();
        const indicator = document.createElement('div');
        indicator.id = id;
        indicator.className = 'message bot typing';
        indicator.innerHTML = `
            <p>
                <span class="dot"></span>
                <span class="dot"></span>
                <span class="dot"></span>
            </p>
        `;
        chatMessages.appendChild(indicator);
        chatMessages.scrollTop = chatMessages.scrollHeight;
        return id;
    }

    function removeTypingIndicator(id) {
        const indicator = document.getElementById(id);
        if (indicator) indicator.remove();
    }
});

// Add typing indicator styles
const typingStyles = document.createElement('style');
typingStyles.textContent = `
    .message.typing .dot {
        display: inline-block;
        width: 8px;
        height: 8px;
        background: var(--primary, #2563eb);
        border-radius: 50%;
        margin: 0 2px;
        animation: typingDot 1.4s infinite;
    }
    .message.typing .dot:nth-child(2) { animation-delay: 0.2s; }
    .message.typing .dot:nth-child(3) { animation-delay: 0.4s; }
    @keyframes typingDot {
        0%, 60%, 100% { transform: translateY(0); opacity: 0.6; }
        30% { transform: translateY(-10px); opacity: 1; }
    }
`;
document.head.appendChild(typingStyles);

console.log('🤖 AI Advisor Module initialized');
