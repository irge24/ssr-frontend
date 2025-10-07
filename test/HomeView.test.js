import { render, screen } from '@testing-library/vue'
import HomeView from '../src/views/HomeView.vue'

vi.mock('../src/services/api', () => ({
    default: {
        get: vi.fn().mockResolvedValue({
        data: {
            data: [
            { _id: '1', title: 'Doc 1' },
            { _id: '2', title: 'Doc 2' }
            ]
        }
        })
    }
    }))

    describe('HomeView.vue', () => {
    const routerLinkStub = {
        template: '<span><slot /></span>'
    }

    test('renders the home page heading', () => {
        render(HomeView, {
        global: {
            stubs: {
            'router-link': routerLinkStub
            }
        }
        })
        expect(screen.getByRole('heading', { name: /all documents/i })).toBeTruthy()
    })

    test('renders the "Create a new document" button', () => {
        render(HomeView, {
        global: {
            stubs: {
            'router-link': routerLinkStub
            }
        }
        })
        const button = screen.getByRole('button', { name: /create a new document/i })
        expect(button).toBeTruthy()
    })
})