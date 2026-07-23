import { useEffect, useState } from 'react'
import { fetchSummary, fetchProvinceStats, fetchTechnologyStats, fetchScoreDistribution, fetchIdmStatus, fetchScoringExplain, fetchDataSources } from './api'
import Navbar from './components/Navbar'
import HeroSection from './components/HeroSection'
import RankingTable from './components/RankingTable'
import MethodologySection from './components/MethodologySection'
import ChartsSection from './components/ChartsSection'
import Footer from './components/Footer'

export default function App() {
  const [data, setData] = useState({ loading: true, error: null })

  useEffect(() => {
    Promise.all([
      fetchSummary().catch(() => null),
      fetchProvinceStats().catch(() => []),
      fetchTechnologyStats().catch(() => []),
      fetchScoreDistribution().catch(() => []),
      fetchIdmStatus().catch(() => []),
      fetchScoringExplain().catch(() => null),
      fetchDataSources().catch(() => []),
    ])
    .then(([summary, provStats, techStats, scoreDist, idmStatus, scoringExplain, dataSources]) => {
      setData({
        loading: false, error: null,
        summary, provStats, techStats, scoreDist, idmStatus, scoringExplain, dataSources,
      })
    })
    .catch(err => setData({ loading: false, error: err.message }))
  }, [])

  if (data.loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#0a0f1a' }}>
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-gold-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-navy-300 text-sm">Memuat dashboard...</p>
        </div>
      </div>
    )
  }

  if (data.error) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#0a0f1a' }}>
        <div className="text-center max-w-md p-8">
          <p className="text-red-400 text-lg font-semibold mb-2">Gagal Memuat Dashboard</p>
          <p className="text-navy-300 text-sm mb-4">{data.error}</p>
          <p className="text-navy-500 text-xs">Pastikan server backend berjalan</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen w-full" style={{ background: '#0d1421' }}>
      <Navbar />
      <HeroSection summary={data.summary} />
      <RankingTable provStats={data.provStats} />
      <div id="metodologi">
        <MethodologySection
          explain={data.scoringExplain}
          embedded={true}
          villages={data.villages}
        />
      </div>
      <ChartsSection
        provStats={data.provStats}
        techStats={data.techStats}
        scoreDist={data.scoreDist}
        idmStatus={data.idmStatus}
        scoringExplain={data.scoringExplain}
        dataSources={data.dataSources}
      />
      <Footer />
    </div>
  )
}
