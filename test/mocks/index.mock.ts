import { mock } from 'bun:test'

export const createMock = <T>(overrides: Partial<Record<keyof T, ReturnType<typeof mock>>>): T => {
  return overrides as unknown as T
}
