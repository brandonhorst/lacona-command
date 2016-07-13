/** @jsx createElement */

import demoExecute from './demo'
import moment from 'moment'

import {createElement} from 'elliptical'
import {Command, BooleanSetting, BooleanCommand, TimeDuration} from 'lacona-phrases'

function setSetting (result, invert = false) {
  if (result.verb === 'enable' || result.verb === 'disable' && invert) {
    result.settings.forEach(({element, result}) => {
      element.type.setSetting(result == null ? true : result)
    })
  } else if (result.verb === 'disable' || result.verb === 'enable' && invert) {
    result.settings.forEach(({element, result}) => {
      element.type.setSetting(result == null ? false : !result)
    })
  } else if (result.verb === 'toggle') {
    result.settings.forEach(({element}) => {
      Promise.resolve(element.type.getSetting()).then(enabled => {
        element.type.setSetting(!enabled)
      })
    })
  }
}

function doCommand (result, value) {
  result.command.element.type.execute(value)
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
        <repeat id='settings' unique separator={<list items={[' and ', ', and ', ', ']} limit={1} category='conjunction' />} ellipsis>
          <BooleanSetting suppressEmpty={false} />
        </repeat>
        <sequence id='duration'>
          <literal text=' for ' category='conjunction' />
          <TimeDuration merge />
        </sequence>
      </sequence>
    )
  }
}


const BooleanCommandCommand = {
  extends: [Command],

  demoExecute,

  execute (result) {
    if (result.duration) {
      const ms = moment.duration(result.duration).asMilliseconds()
      setTimeout(() => doCommand(result, result.command.result == null ? false : !result.command.result), ms)
    }
    
    doCommand(result, result.command.result == null ? true : result.command.result)
  },

  describe () {
    return (
      <sequence>
        <BooleanCommand id='command' suppressEmpty={false} ellipsis />
        <sequence id='duration'>
          <literal text=' for ' />
          <TimeDuration merge />
        </sequence>
      </sequence>
    )
  }
}

export default [BooleanSettingCommand, BooleanCommandCommand]
