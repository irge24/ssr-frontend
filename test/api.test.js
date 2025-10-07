import { describe, test, expect, beforeEach } from 'vitest'
import MockAdapter from 'axios-mock-adapter'
import api from '../src/services/api.js'

describe('API service', () => {
    let mock

    beforeEach(() => {
        mock = new MockAdapter(api)
    })

    test('should fetch posts', async () => {
        const posts = [{ id: 1, title: 'Test post' }]
    
        mock.onGet('/').reply(200, posts)

        const response = await api.get('/')
        expect(response.status).toBe(200)
        expect(response.data).toEqual(posts)
    })

    test('should handle errors', async () => {
        mock.onGet('/').reply(500)

        try {
            await api.get('/')
        } catch (error) {
            expect(error.response.status).toBe(500)
        }
    })
})
