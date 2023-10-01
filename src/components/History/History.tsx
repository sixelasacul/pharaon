import { getHistory } from '../../utils/history'

export function History() {
  const history = getHistory()
  return (
    <ul>
      {history.map((entry) => (
        <li key={entry.id}>
          <a href={`#${entry.id}`}>
            {entry.name} - {entry.artists}
          </a>
        </li>
      ))}
    </ul>
  )
}
