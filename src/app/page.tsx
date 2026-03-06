import FrontendLayout from './(frontend)/layout'
import HomePage from './(frontend)/HomePage'

export const dynamic = 'force-dynamic'

export default function RootPage() {
  return (
    <FrontendLayout>
      <HomePage />
    </FrontendLayout>
  )
}
