import { render, screen } from '@testing-library/react'
import { ProtectionPanel } from '@/components/upload/protection-panel'
import '@testing-library/jest-dom'

describe('ProtectionPanel', () => {
    it('renders all protection options', () => {
        const mockState = {
            crypto: true,
            binary: true,
            cloaking: true,
        }
        const mockOnChange = jest.fn()

        render(
            <ProtectionPanel
                state={mockState}
                onChange={mockOnChange}
                disabled={false}
            />
        )

        expect(screen.getByText('Cryptographic Signing')).toBeInTheDocument()
        expect(screen.getByText('Binary Shielding')).toBeInTheDocument()
        expect(screen.getByText('AI Cloaking')).toBeInTheDocument()
    })
})
