/** @jsx createElement */

import demoExecute from './demo'
import moment from 'moment'

import {createElement} from 'elliptical'
import {Command, BooleanSetting, TimeDuration} from 'lacona-phrases'
import {setTimeout} from 'lacona-api'

function setSetting (result, invert = false) {
  if (result.verb === 'enable' || result.verb === 'disable' && invert) {
    result.setting.enable()
  } else if (result.verb === 'disable' || result.verb === 'enable' && invert) {
    result.setting.disable()
  } else if (result.verb === 'toggle') {
    result.setting.toggle()
  }
}

const BooleanSettingCommand = {
  extends: [Command],

  demoExecute,

  execute (result) {
    if (result.duration) {
      const ms = moment.duration(result.duration).asMilliseconds()
      setTimeout(() => setSetting(result, true), ms)
    }
    
    setSetting(result)
  },

  describe () {
    return (
      <sequence>
        <list items={[
          {text: 'disable ', value: 'disable'},
          {text: 'enable ', value: 'enable'},
          {text: 'toggle ', value: 'toggle'},
          {text: 'turn off ', value: 'disable'},
          {text: 'turn on ', value: 'enable'}
        ]} limit={3} category='action' id='verb' />
        <BooleanSetting id='setting' />
        <sequence optional id='duration'>
          <literal text=' for ' category='conjunction' />
          <TimeDuration merge />
        </sequence>
      </sequence>
    )
  }
}

export default [BooleanSettingCommand]
