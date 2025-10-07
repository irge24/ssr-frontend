import { render, screen } from '@testing-library/vue'
import DocView from '../src/views/DocView.vue'

vi.mock('../src/services/api', () => {
    return {
        default: {
        get: vi.fn().mockResolvedValue({
            data: {
            data: {
                title: 'Test Document',
                content: 'Test Content'
            }
            }
        }),
        }
    }
})

    describe('DocView.vue', () => {
    test('renders document content', async () => {
        render(DocView, {
        global: {
            stubs: {
            'router-link': true
            },
            mocks: {
            $route: { params: { id: '1' } }
            }
        }
        })

        const heading = await screen.findByRole('heading', { name: /Test Document/i })
        expect(heading).toBeTruthy()
    })
})