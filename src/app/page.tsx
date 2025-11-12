'use client'

import { useState } from 'react'
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Target,
  AlertCircle,
  CheckCircle,
  ArrowUpRight,
  Sparkles,
  MapPin,
  Users,
  Trophy,
  TrendingDown as TrendingDownIcon,
  Zap,
  Calendar,
  PiggyBank,
  LineChart,
  Map
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

// DADOS MOCK EXPANDIDOS
const mockTransactions = [
  // Dezembro 2024
  { id: 1, type: 'expense', amount: 450.00, category: 'Delivery', description: 'iFood - Jantar', date: '2024-12-15', location: { lat: -23.550520, lng: -46.633308, name: 'Av. Paulista, São Paulo' } },
  { id: 2, type: 'expense', amount: 380.00, category: 'Delivery', description: 'Rappi - Almoço', date: '2024-12-14', location: { lat: -23.561414, lng: -46.656139, name: 'Pinheiros, São Paulo' } },
  { id: 3, type: 'income', amount: 6500.00, category: 'Salário', description: 'Salário Dezembro', date: '2024-12-01', location: { lat: -23.550520, lng: -46.633308, name: 'Transferência Bancária' } },
  { id: 4, type: 'expense', amount: 850.00, category: 'Transporte', description: 'Combustível + Uber', date: '2024-12-14', location: { lat: -23.550520, lng: -46.633308, name: 'Posto Shell - Av. Paulista' } },
  { id: 5, type: 'expense', amount: 1800.00, category: 'Moradia', description: 'Aluguel', date: '2024-12-01', location: { lat: -23.550520, lng: -46.633308, name: 'São Paulo' } },
  { id: 6, type: 'expense', amount: 320.00, category: 'Lazer', description: 'Cinema + Jantar', date: '2024-12-12', location: { lat: -23.561414, lng: -46.656139, name: 'Shopping Iguatemi' } },
  { id: 7, type: 'expense', amount: 180.00, category: 'Saúde', description: 'Farmácia', date: '2024-12-08', location: { lat: -23.550520, lng: -46.633308, name: 'Drogasil - Centro' } },
  { id: 8, type: 'expense', amount: 280.00, category: 'Delivery', description: 'Uber Eats - Final de Semana', date: '2024-12-03', location: { lat: -23.550520, lng: -46.633308, name: 'São Paulo' } },
  
  // Novembro 2024
  { id: 9, type: 'expense', amount: 520.00, category: 'Delivery', description: 'iFood - Semana', date: '2024-11-28', location: { lat: -23.550520, lng: -46.633308, name: 'São Paulo' } },
  { id: 10, type: 'expense', amount: 450.00, category: 'Moradia', description: 'Conta de Luz', date: '2024-11-28', location: { lat: -23.550520, lng: -46.633308, name: 'Enel SP' } },
  { id: 11, type: 'expense', amount: 340.00, category: 'Delivery', description: 'Rappi + iFood', date: '2024-11-18', location: { lat: -23.550520, lng: -46.633308, name: 'São Paulo' } },
  { id: 12, type: 'expense', amount: 720.00, category: 'Transporte', description: 'Combustível', date: '2024-11-22', location: { lat: -23.550520, lng: -46.633308, name: 'Posto BR' } },
  { id: 13, type: 'expense', amount: 220.00, category: 'Delivery', description: 'Uber Eats', date: '2024-11-12', location: { lat: -23.550520, lng: -46.633308, name: 'São Paulo' } },
  
  // Outubro 2024
  { id: 14, type: 'income', amount: 6500.00, category: 'Salário', description: 'Salário Outubro', date: '2024-10-30', location: { lat: -23.550520, lng: -46.633308, name: 'Transferência Bancária' } },
  { id: 15, type: 'expense', amount: 890.00, category: 'Transporte', description: 'Combustível + Manutenção', date: '2024-10-25', location: { lat: -23.550520, lng: -46.633308, name: 'São Paulo' } },
  { id: 16, type: 'expense', amount: 410.00, category: 'Delivery', description: 'iFood - Mês', date: '2024-10-20', location: { lat: -23.550520, lng: -46.633308, name: 'São Paulo' } },
]

// Dados de comparação com média de usuários
const userComparison = {
  delivery: { user: 27, average: 15, difference: 12 }, // Usuário gasta 12% A MAIS
  transporte: { user: 12, average: 18, difference: -6 }, // Usuário gasta 6% A MENOS
  lazer: { user: 8, average: 10, difference: -2 },
  saude: { user: 5, average: 7, difference: -2 },
}

// Análise de IA dos hábitos
const aiInsights = [
  {
    id: 1,
    type: 'warning',
    category: 'Delivery',
    title: 'Você gastou 27% mais com delivery este mês',
    description: 'Seus gastos com delivery aumentaram de R$ 870 (nov) para R$ 1.110 (dez). Isso representa R$ 240 a mais.',
    impact: 'high',
    suggestion: 'Considere cozinhar em casa 2-3 vezes por semana. Economia estimada: R$ 400/mês',
    savings: 400
  },
  {
    id: 2,
    type: 'success',
    category: 'Transporte',
    title: 'Você gasta 12% menos em transporte que a média',
    description: 'Parabéns! Seus gastos com transporte (R$ 850) estão abaixo da média de usuários similares (R$ 1.200).',
    impact: 'positive',
    suggestion: 'Continue otimizando suas rotas e usando transporte compartilhado',
    savings: 0
  },
  {
    id: 3,
    type: 'info',
    category: 'Lazer',
    title: 'Padrão saudável de gastos com lazer',
    description: 'Seus gastos com lazer representam 8% do orçamento, dentro do recomendado (5-10%).',
    impact: 'neutral',
    suggestion: 'Mantenha o equilíbrio atual entre diversão e economia',
    savings: 0
  },
  {
    id: 4,
    type: 'opportunity',
    category: 'Geral',
    title: 'Oportunidade de economia identificada',
    description: 'Reduzindo delivery em 30% e otimizando compras, você pode economizar R$ 550/mês.',
    impact: 'high',
    suggestion: 'Crie um plano de refeições semanal e faça compras em atacado',
    savings: 550
  }
]

// Meta financeira do usuário
const financialGoal = {
  name: 'Comprar Moto',
  targetAmount: 15000,
  currentAmount: 3200,
  monthlyContribution: 800,
  deadline: '2025-12-31',
  category: 'Veículo',
  priority: 'high'
}

// Calcular meses restantes e plano automático
const calculateGoalPlan = () => {
  const remaining = financialGoal.targetAmount - financialGoal.currentAmount
  const monthsToDeadline = 12 // Aproximadamente 1 ano
  const requiredMonthly = remaining / monthsToDeadline
  const currentMonthly = financialGoal.monthlyContribution
  const deficit = requiredMonthly - currentMonthly
  
  return {
    remaining,
    monthsToDeadline,
    requiredMonthly,
    currentMonthly,
    deficit,
    onTrack: deficit <= 0
  }
}

// Score de saúde financeira
const financialHealthScore = {
  score: 72,
  level: 'Bom',
  color: 'text-green-600',
  bgColor: 'bg-green-100',
  factors: [
    { name: 'Taxa de Economia', score: 85, weight: 30 },
    { name: 'Controle de Gastos', score: 65, weight: 25 },
    { name: 'Diversificação', score: 70, weight: 20 },
    { name: 'Dívidas', score: 80, weight: 15 },
    { name: 'Reserva de Emergência', score: 60, weight: 10 }
  ]
}

export default function FinancialPlatform() {
  const [activeTab, setActiveTab] = useState('dashboard')
  const [isGoalDialogOpen, setIsGoalDialogOpen] = useState(false)
  const [newGoal, setNewGoal] = useState({
    name: '',
    targetAmount: '',
    deadline: '',
    category: ''
  })

  const goalPlan = calculateGoalPlan()

  // Cálculos principais
  const totalIncome = mockTransactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0)
  const totalExpenses = mockTransactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0)
  const balance = totalIncome - totalExpenses

  // Análise de delivery (categoria problema)
  const deliveryExpenses = mockTransactions.filter(t => t.category === 'Delivery').reduce((sum, t) => sum + t.amount, 0)
  const deliveryPercentage = (deliveryExpenses / totalExpenses) * 100

  // Gastos por localização
  const locationData = mockTransactions
    .filter(t => t.type === 'expense' && t.location)
    .reduce((acc: any, t) => {
      const key = t.location.name
      if (!acc[key]) {
        acc[key] = { name: key, amount: 0, count: 0, lat: t.location.lat, lng: t.location.lng }
      }
      acc[key].amount += t.amount
      acc[key].count += 1
      return acc
    }, {})

  const topLocations = Object.values(locationData)
    .sort((a: any, b: any) => b.amount - a.amount)
    .slice(0, 5)

  const renderDashboard = () => (
    <div className="space-y-6">
      {/* Cards de Resumo */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-purple-200 bg-gradient-to-br from-purple-50 to-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Saldo Total</CardTitle>
            <DollarSign className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-900">
              R$ {balance.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </div>
            <p className="text-xs text-purple-600 flex items-center mt-1">
              <ArrowUpRight className="h-3 w-3 mr-1" />
              +12% em relação ao mês anterior
            </p>
          </CardContent>
        </Card>

        <Card className="border-green-200 bg-gradient-to-br from-green-50 to-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Receitas</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-900">
              R$ {totalIncome.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </div>
            <p className="text-xs text-green-600">Este mês</p>
          </CardContent>
        </Card>

        <Card className="border-red-200 bg-gradient-to-br from-red-50 to-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Despesas</CardTitle>
            <TrendingDown className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-900">
              R$ {totalExpenses.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </div>
            <p className="text-xs text-red-600">Este mês</p>
          </CardContent>
        </Card>

        <Card className="border-blue-200 bg-gradient-to-br from-blue-50 to-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Score Financeiro</CardTitle>
            <Trophy className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-900">
              {financialHealthScore.score}/100
            </div>
            <p className="text-xs text-blue-600">{financialHealthScore.level}</p>
          </CardContent>
        </Card>
      </div>

      {/* Análise de IA - Destaque */}
      <Card className="border-orange-300 bg-gradient-to-r from-orange-50 via-yellow-50 to-orange-50">
        <CardHeader>
          <CardTitle className="text-orange-900 flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-orange-600" />
            Análise Inteligente dos seus Hábitos
          </CardTitle>
          <CardDescription className="text-orange-700">
            IA identificou padrões importantes nos seus gastos
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {aiInsights.map((insight) => (
            <div 
              key={insight.id}
              className={`p-4 rounded-lg border-2 ${
                insight.type === 'warning' ? 'bg-red-50 border-red-200' :
                insight.type === 'success' ? 'bg-green-50 border-green-200' :
                insight.type === 'opportunity' ? 'bg-blue-50 border-blue-200' :
                'bg-gray-50 border-gray-200'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    {insight.type === 'warning' && <AlertCircle className="h-5 w-5 text-red-600" />}
                    {insight.type === 'success' && <CheckCircle className="h-5 w-5 text-green-600" />}
                    {insight.type === 'opportunity' && <Zap className="h-5 w-5 text-blue-600" />}
                    {insight.type === 'info' && <Sparkles className="h-5 w-5 text-gray-600" />}
                    <h3 className="font-bold text-gray-900">{insight.title}</h3>
                  </div>
                  <p className="text-sm text-gray-700 mb-2">{insight.description}</p>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs">
                      {insight.category}
                    </Badge>
                    {insight.savings > 0 && (
                      <Badge className="bg-green-600 text-white text-xs">
                        💰 Economia: R$ {insight.savings}/mês
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 mt-2 italic">
                    💡 {insight.suggestion}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Comparação com Outros Usuários */}
      <Card className="border-indigo-200">
        <CardHeader>
          <CardTitle className="text-indigo-900 flex items-center gap-2">
            <Users className="h-5 w-5 text-indigo-600" />
            Comparação com Outros Usuários
          </CardTitle>
          <CardDescription>
            Veja como seus gastos se comparam com a média (anônimo)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Object.entries(userComparison).map(([category, data]) => (
              <div key={category} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-700 capitalize">{category}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600">
                      Você: {data.user}% | Média: {data.average}%
                    </span>
                    <Badge 
                      className={`${
                        data.difference < 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {data.difference > 0 ? '+' : ''}{data.difference}%
                    </Badge>
                  </div>
                </div>
                <div className="flex gap-2">
                  <div className="flex-1">
                    <Progress value={data.user} className="h-2 bg-blue-100" />
                    <p className="text-xs text-gray-500 mt-1">Você</p>
                  </div>
                  <div className="flex-1">
                    <Progress value={data.average} className="h-2 bg-gray-200" />
                    <p className="text-xs text-gray-500 mt-1">Média</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Mapa de Gastos Geográfico */}
      <Card className="border-teal-200">
        <CardHeader>
          <CardTitle className="text-teal-900 flex items-center gap-2">
            <Map className="h-5 w-5 text-teal-600" />
            Mapa de Gastos - Onde Você Gasta Mais
          </CardTitle>
          <CardDescription>
            Visualize seus gastos por localização
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {topLocations.map((location: any, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-teal-50 rounded-lg border border-teal-200">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-teal-600 text-white rounded-full flex items-center justify-center font-bold">
                    {index + 1}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 flex items-center gap-1">
                      <MapPin className="h-4 w-4 text-teal-600" />
                      {location.name}
                    </p>
                    <p className="text-xs text-gray-600">{location.count} transações</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-teal-900">
                    R$ {location.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </p>
                  <p className="text-xs text-gray-600">
                    {((location.amount / totalExpenses) * 100).toFixed(1)}% do total
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )

  const renderGoals = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Assistente Financeiro com Metas</h2>
        <Dialog open={isGoalDialogOpen} onOpenChange={setIsGoalDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:from-purple-700 hover:to-blue-700">
              <Target className="h-4 w-4 mr-2" />
              Nova Meta
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Criar Nova Meta Financeira</DialogTitle>
              <DialogDescription>
                A IA criará um plano automático de economia para você
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="goal-name">Nome da Meta *</Label>
                <Input 
                  id="goal-name" 
                  placeholder="Ex: Comprar moto, Viagem, Casa própria..." 
                  value={newGoal.name}
                  onChange={(e) => setNewGoal(prev => ({ ...prev, name: e.target.value }))}
                />
              </div>
              
              <div>
                <Label htmlFor="goal-amount">Valor Necessário *</Label>
                <Input 
                  id="goal-amount" 
                  placeholder="R$ 0,00" 
                  value={newGoal.targetAmount}
                  onChange={(e) => setNewGoal(prev => ({ ...prev, targetAmount: e.target.value }))}
                />
              </div>
              
              <div>
                <Label htmlFor="goal-deadline">Prazo Desejado *</Label>
                <Input 
                  id="goal-deadline" 
                  type="date"
                  value={newGoal.deadline}
                  onChange={(e) => setNewGoal(prev => ({ ...prev, deadline: e.target.value }))}
                />
              </div>
              
              <div>
                <Label htmlFor="goal-category">Categoria</Label>
                <Select value={newGoal.category} onValueChange={(value) => setNewGoal(prev => ({ ...prev, category: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="veiculo">🏍️ Veículo</SelectItem>
                    <SelectItem value="imovel">🏠 Imóvel</SelectItem>
                    <SelectItem value="viagem">✈️ Viagem</SelectItem>
                    <SelectItem value="educacao">🎓 Educação</SelectItem>
                    <SelectItem value="emergencia">🚨 Emergência</SelectItem>
                    <SelectItem value="outro">💰 Outro</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <Button 
                className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white"
                disabled={!newGoal.name || !newGoal.targetAmount || !newGoal.deadline}
              >
                <Sparkles className="h-4 w-4 mr-2" />
                Criar Plano Automático
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Meta Atual */}
      <Card className="border-purple-300 bg-gradient-to-br from-purple-50 to-blue-50">
        <CardHeader>
          <CardTitle className="text-purple-900 flex items-center gap-2">
            <PiggyBank className="h-6 w-6 text-purple-600" />
            {financialGoal.name}
          </CardTitle>
          <CardDescription>
            Plano automático gerado pela IA
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Progresso Visual */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Progresso</span>
              <span className="font-bold text-purple-900">
                R$ {financialGoal.currentAmount.toLocaleString('pt-BR')} / R$ {financialGoal.targetAmount.toLocaleString('pt-BR')}
              </span>
            </div>
            <Progress 
              value={(financialGoal.currentAmount / financialGoal.targetAmount) * 100} 
              className="h-3"
            />
            <p className="text-xs text-gray-600 text-center">
              {((financialGoal.currentAmount / financialGoal.targetAmount) * 100).toFixed(1)}% concluído
            </p>
          </div>

          {/* Plano Automático */}
          <div className="bg-white p-4 rounded-lg border-2 border-purple-200">
            <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-purple-600" />
              Plano Automático de Economia
            </h3>
            
            <div className="space-y-3">
              <div className="flex justify-between items-center p-2 bg-purple-50 rounded">
                <span className="text-sm text-gray-700">Faltam</span>
                <span className="font-bold text-purple-900">
                  R$ {goalPlan.remaining.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </span>
              </div>
              
              <div className="flex justify-between items-center p-2 bg-blue-50 rounded">
                <span className="text-sm text-gray-700">Prazo</span>
                <span className="font-bold text-blue-900">
                  {goalPlan.monthsToDeadline} meses
                </span>
              </div>
              
              <div className="flex justify-between items-center p-2 bg-green-50 rounded">
                <span className="text-sm text-gray-700">Necessário por mês</span>
                <span className="font-bold text-green-900">
                  R$ {goalPlan.requiredMonthly.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </span>
              </div>
              
              <div className="flex justify-between items-center p-2 bg-yellow-50 rounded">
                <span className="text-sm text-gray-700">Você economiza</span>
                <span className="font-bold text-yellow-900">
                  R$ {goalPlan.currentMonthly.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}/mês
                </span>
              </div>

              {!goalPlan.onTrack && (
                <div className="p-3 bg-red-50 border-2 border-red-200 rounded-lg">
                  <div className="flex items-start gap-2">
                    <AlertCircle className="h-5 w-5 text-red-600 mt-0.5" />
                    <div>
                      <p className="font-bold text-red-900 text-sm">Atenção!</p>
                      <p className="text-xs text-red-700 mt-1">
                        Você precisa economizar mais R$ {goalPlan.deficit.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}/mês para atingir sua meta no prazo.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {goalPlan.onTrack && (
                <div className="p-3 bg-green-50 border-2 border-green-200 rounded-lg">
                  <div className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                    <div>
                      <p className="font-bold text-green-900 text-sm">Parabéns!</p>
                      <p className="text-xs text-green-700 mt-1">
                        Você está no caminho certo para atingir sua meta no prazo!
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Sugestões da IA */}
          <div className="bg-orange-50 p-4 rounded-lg border-2 border-orange-200">
            <h3 className="font-bold text-orange-900 mb-2 flex items-center gap-2">
              <Zap className="h-5 w-5" />
              Sugestões da IA para Acelerar
            </h3>
            <ul className="space-y-2 text-sm text-orange-800">
              <li className="flex items-start gap-2">
                <span className="text-orange-600">•</span>
                <span>Reduza delivery em 30% → Economize R$ 333/mês</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-orange-600">•</span>
                <span>Otimize transporte usando apps compartilhados → Economize R$ 150/mês</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-orange-600">•</span>
                <span>Cancele assinaturas não usadas → Economize R$ 80/mês</span>
              </li>
            </ul>
            <p className="text-xs text-orange-700 mt-3 font-medium">
              💰 Economia total possível: R$ 563/mês
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )

  const renderHealthScore = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Pontuação de Saúde Financeira</h2>

      {/* Score Principal */}
      <Card className="border-blue-300 bg-gradient-to-br from-blue-50 to-indigo-50">
        <CardContent className="pt-6">
          <div className="text-center space-y-4">
            <div className="inline-flex items-center justify-center w-32 h-32 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-white">
              <div>
                <p className="text-4xl font-bold">{financialHealthScore.score}</p>
                <p className="text-sm">/ 100</p>
              </div>
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-900">{financialHealthScore.level}</h3>
              <p className="text-gray-600">Sua saúde financeira está acima da média!</p>
            </div>
            <div className="flex justify-center gap-2">
              <Badge className="bg-blue-100 text-blue-800">
                Top 30% dos usuários
              </Badge>
              <Badge className="bg-green-100 text-green-800">
                +5 pontos este mês
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Fatores do Score */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <LineChart className="h-5 w-5 text-blue-600" />
            Fatores que Compõem seu Score
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {financialHealthScore.factors.map((factor) => (
            <div key={factor.name} className="space-y-2">
              <div className="flex justify-between items-center">
                <div>
                  <span className="text-sm font-medium text-gray-700">{factor.name}</span>
                  <span className="text-xs text-gray-500 ml-2">({factor.weight}% do score)</span>
                </div>
                <span className="font-bold text-gray-900">{factor.score}/100</span>
              </div>
              <Progress value={factor.score} className="h-2" />
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Conquistas */}
      <Card className="border-yellow-300 bg-gradient-to-br from-yellow-50 to-orange-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-yellow-900">
            <Trophy className="h-5 w-5 text-yellow-600" />
            Conquistas Desbloqueadas
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-white rounded-lg border-2 border-yellow-200">
              <div className="text-3xl mb-2">🏆</div>
              <p className="text-xs font-medium text-gray-700">Primeiro Mês</p>
            </div>
            <div className="text-center p-4 bg-white rounded-lg border-2 border-yellow-200">
              <div className="text-3xl mb-2">💰</div>
              <p className="text-xs font-medium text-gray-700">Economizador</p>
            </div>
            <div className="text-center p-4 bg-white rounded-lg border-2 border-yellow-200">
              <div className="text-3xl mb-2">📊</div>
              <p className="text-xs font-medium text-gray-700">Organizado</p>
            </div>
            <div className="text-center p-4 bg-gray-100 rounded-lg border-2 border-gray-300 opacity-50">
              <div className="text-3xl mb-2">🎯</div>
              <p className="text-xs font-medium text-gray-500">Meta Atingida</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
      {/* Header */}
      <header className="border-b border-purple-200 bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                <Sparkles className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                  FinanceAI
                </h1>
                <p className="text-xs text-gray-500">Inteligência Financeira</p>
              </div>
            </div>
            <Badge className="bg-gradient-to-r from-purple-600 to-blue-600 text-white">
              <Trophy className="h-3 w-3 mr-1" />
              Score: {financialHealthScore.score}
            </Badge>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="border-b border-purple-200 bg-white/80 backdrop-blur-sm sticky top-16 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3 bg-purple-50">
              <TabsTrigger value="dashboard" className="flex items-center space-x-2">
                <Sparkles className="h-4 w-4" />
                <span className="hidden sm:inline">Análise IA</span>
              </TabsTrigger>
              <TabsTrigger value="goals" className="flex items-center space-x-2">
                <Target className="h-4 w-4" />
                <span className="hidden sm:inline">Metas</span>
              </TabsTrigger>
              <TabsTrigger value="health" className="flex items-center space-x-2">
                <Trophy className="h-4 w-4" />
                <span className="hidden sm:inline">Score</span>
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsContent value="dashboard">
            {renderDashboard()}
          </TabsContent>
          <TabsContent value="goals">
            {renderGoals()}
          </TabsContent>
          <TabsContent value="health">
            {renderHealthScore()}
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
