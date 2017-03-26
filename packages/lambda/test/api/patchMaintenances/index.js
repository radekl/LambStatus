import assert from 'assert'
import sinon from 'sinon'
import { handle } from 'api/patchMaintenances'
import { Maintenance } from 'model/maintenances'

describe('patchMaintenances', () => {
  afterEach(() => {
    Maintenance.prototype.validate.restore()
    Maintenance.prototype.save.restore()
  })

  it('should update the maintenance', async () => {
    const validateStub = sinon.stub(Maintenance.prototype, 'validate').returns('')
    const saveStub = sinon.stub(Maintenance.prototype, 'save').returns('')

    await handle({ params: { maintenanceid: '1' }, body: { components: [] } }, null, (error, result) => {
      assert(error === null)
      const obj = JSON.parse(result)
      assert(obj.maintenance.maintenanceID === '1')
      assert.deepEqual(obj.components, [])
    })
    assert(validateStub.calledOnce)
    assert(saveStub.calledOnce)
  })

  it('should return error on exception thrown', async () => {
    sinon.stub(Maintenance.prototype, 'validate').throws()
    sinon.stub(Maintenance.prototype, 'save').throws()
    return await handle({ params: { maintenanceid: '1' }, body: { components: [] } }, null, (error, result) => {
      assert(error.match(/Error/))
    })
  })
})
