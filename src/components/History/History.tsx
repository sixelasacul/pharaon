import { getHistory } from '../../utils/history'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card'

const formatter = new Intl.DateTimeFormat('fr-FR', {
  dateStyle: 'medium',
  timeStyle: 'short'
})

function defaultString(str: string) {
  return str === '' ? 'Inconnu' : str
}

export function History() {
  const history = getHistory()
  return (
    <ul className='flex flex-col gap-2 md:gap-4'>
      {history.map((entry) => (
        <li key={entry.id}>
          <a href={`#${entry.id}`}>
            <Card className='hover:bg-slate-50' elevated={false}>
              <CardHeader>
                <CardTitle>{defaultString(entry.name)}</CardTitle>
                <CardDescription>
                  {defaultString(entry.artists)}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p>
                  Dernière modification : {formatter.format(entry.updatedAt)}
                </p>
              </CardContent>
            </Card>
          </a>
        </li>
      ))}
    </ul>
  )
}
