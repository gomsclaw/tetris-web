import { render, screen, fireEvent } from '@testing-library/react'
import { beforeEach } from 'vitest'
import App from '../App'
import { useTetrisStore } from '../game/store'
import { initGameState } from '../game/engine'

beforeEach(() => {
  useTetrisStore.setState({ screen: 'entry', game: initGameState(), bestScore: 0 })
})

describe('App', () => {
  it('초기 화면: 헤드라인과 지금 플레이 버튼 표시', () => {
    render(<App />)
    expect(screen.getByText('설치 없이 바로, 클래식 테트리스')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /지금 플레이/i })).toBeInTheDocument()
  })

  it('지금 플레이 클릭 시 screen=playing으로 전환', () => {
    render(<App />)
    fireEvent.click(screen.getByRole('button', { name: /지금 플레이/i }))
    expect(useTetrisStore.getState().screen).toBe('playing')
  })

  it('paused 상태에서 일시정지 오버레이 표시', () => {
    useTetrisStore.setState({ screen: 'paused', game: { ...initGameState(), paused: true } })
    render(<App />)
    expect(screen.getByRole('dialog', { name: /일시정지/ })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /resume/i })).toBeInTheDocument()
  })

  it('gameover 상태에서 Game Over 오버레이 표시', () => {
    useTetrisStore.setState({ screen: 'gameover', game: { ...initGameState(), gameOver: true } })
    render(<App />)
    expect(screen.getByRole('dialog', { name: /게임 오버/ })).toBeInTheDocument()
  })

  it('게임 화면에서 GameBoard가 렌더링됨', () => {
    useTetrisStore.setState({ screen: 'playing' })
    render(<App />)
    expect(screen.getByRole('grid', { name: /테트리스 게임 보드/ })).toBeInTheDocument()
  })
})
