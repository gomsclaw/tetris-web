import { render, screen } from '@testing-library/react'
import App from '../App'

describe('App', () => {
  it('게임 제목이 렌더링된다', () => {
    render(<App />)
    expect(screen.getByText('Web Tetris')).toBeInTheDocument()
  })
})
