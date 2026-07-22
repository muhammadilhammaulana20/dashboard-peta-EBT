import { useEffect, useState } from 'react'
import { fetchSummary, fetchVillages, fetchProvinceStats, fetchTechnologyStats, fetchScoreDistribution, fetchIdmStatus, fetchScoringExplain, fetchDataSources } from './api'
import Navbar from './components/Navbar'
import HeroSection from './components/HeroSection'
import SummaryCards from './components/SummaryCards'
import RankingTable from './components/RankingTable'
import MethodologySection from './components/MethodologySection'
import ChartsSection from './components/ChartsSection'
import Footer from './components/Footer'

export default function App() {
  const [data, setData] = useState({ loading: true, error: null })
  const [page, setPage] = useState('beranda')

  useEffect(() => {
    Promise.all([
      fetchSummary().catch(() => null),
      fetchVillages({ per_page: 9999 }).catch(() => ({ data: [] })),
      fetchProvinceStats().catch(() => []),
      fetchTechnologyStats().catch(() => []),
      fetchScoreDistribution().catch(() => []),
      fetchIdmStatus().catch(() => []),
      fetchScoringExplain().catch(() => null),
      fetchDataSources().catch(() => []),
    ])
    .then(([summary, villagesResp, provStats, techStats, scoreDist, idmStatus, scoringExplain, dataSources]) => {
      setData({
        loading: false,
        error: null,
        summary,
        villages: villagesResp.data || [],
        provStats,
        techStats,
        scoreDist,
        idmStatus,
        scoringExplain,
        dataSources,
      })
    })
    .catch(err => setData({ loading: false, error: err.message }))
  }, [])

  if (data.loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-navy-900">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-gold-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-navy-200 text-sm">Memuat dashboard...</p>
        </div>
      </div>
    )
  }

  if (data.error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-navy-900">
        <div className="text-center max-w-md p-8">
          <p className="text-red-400 text-lg font-semibold mb-2">Gagal Memuat Dashboard</p>
          <p className="text-navy-200 text-sm mb-4">{data.error}</p>
          <p className="text-navy-400 text-xs">Pastikan server backend berjalan</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-navy-50">
      <Navbar page={page} onPageChange={setPage} />

      {page === 'beranda' && (
        <>
          <HeroSection villages={data.villages} />
          <SummaryCards summary={data.summary} />
          <RankingTable villages={data.villages} provStats={data.provStats} />
          <ChartsSection
            villages={data.villages}
            provStats={data.provStats}
            techStats={data.techStats}
            scoreDist={data.scoreDist}
            idmStatus={data.idmStatus}
            scoringExplain={data.scoringExplain}
            dataSources={data.dataSources}
          />
        </>
      )}

      {page === 'metodologi' && (
        <MethodologySection explain={data.scoringExplain} onBack={() => setPage('beranda')} />
      )}

      <Footer />
    </div>
  )
}
