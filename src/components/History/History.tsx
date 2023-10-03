import { getHistory } from '../../utils/history'
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card'

export function History() {
  const history = getHistory()
  return (
    <ul className='flex flex-col gap-4'>
      {history.map((entry) => (
        <li key={entry.id}>
          <a href={`#${entry.id}`}>
            <Card className='hover:bg-slate-50'>
              <CardHeader>
                <CardTitle>{entry.name}</CardTitle>
                <CardDescription>{entry.artists}</CardDescription>
              </CardHeader>
            </Card>
          </a>
        </li>
      ))}
    </ul>
  )
}
