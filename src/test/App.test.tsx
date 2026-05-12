import { render, screen } from '@testing-library/react'
import App from '../App'

describe('App', () => {
  it('엔트리 화면에 TETRIS 타이틀과 Start Game 버튼이 렌더링된다', () => {
    render(<App />)
    expect(screen.getByText('TETRIS')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Start Game' })).toBeInTheDocument()
  })
})
