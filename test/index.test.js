import { describe, test, expect } from 'vitest'
import router from '@/router'
import HomeView from '@/views/HomeView.vue'
import DocView from '@/views/DocView.vue'
import NewDocView from '@/views/NewDocView.vue'

describe('Router configuration', () => {
    const routes = router.options.routes

    test('has a home route', () => {
        const homeRoute = routes.find(r => r.name === 'home')
        expect(homeRoute).toBeTruthy()
        expect(homeRoute.path).toBe('/')
        expect(homeRoute.component).toBe(HomeView)
    })

    test('has a doc route with props enabled', () => {
        const docRoute = routes.find(r => r.name === 'doc')
        expect(docRoute).toBeTruthy()
        expect(docRoute.path).toBe('/doc/:id')
        expect(docRoute.component).toBe(DocView)
        expect(docRoute.props).toBe(true)
    })

    test('has a newdoc route', () => {
        const newDocRoute = routes.find(r => r.name === 'newdoc')
        expect(newDocRoute).toBeTruthy()
        expect(newDocRoute.path).toBe('/new')
        expect(newDocRoute.component).toBe(NewDocView)
    })
})
