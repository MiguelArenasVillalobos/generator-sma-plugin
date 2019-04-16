import { something } from '../lib/index'

describe('<%= name %>.something', () => {
	it('exists', () => {
		expect(something).toBeTruthy()
	})
	it("returns 'Hello'", () => {
		const returnValue = something()
		expect(returnValue).toBe('Hello')
	})
})
