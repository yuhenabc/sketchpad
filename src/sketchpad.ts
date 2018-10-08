import Options from './interfaces/Options.d'
import Sketchpad from './libs/Sketchpad'

export default function (options: Options) {
    return new Sketchpad(options)
}
