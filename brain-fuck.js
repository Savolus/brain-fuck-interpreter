import readline from 'readline'

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
})

export const brain_fuck = (code, input) => {
  const memory = [], output = [], stack = [], loops = {}
  let memoryPointer = 0, inputPointer = 0, codePointer = 0

  for (let i = 0; i < code.length; i++) {
    if (code[i] === '[') {
      stack.push(i)
    } else if (code[i] === ']') {
      const j = stack.pop()
      loops[i] = j
      loops[j] = i
    }
  }

  const loop = (start, end) => {
    while (true) {
      command[code[++codePointer]]()

      if (codePointer === end) {
        if (memory[memoryPointer] === 0) {
          break
        }

        codePointer = start
      }
    }
  }

  const command = {
    '>': () => memoryPointer++,
    '<': () => memoryPointer--,
    '+': () => memory[memoryPointer] = ((memory[memoryPointer] || 0) + 1) % 256,
    '-': () => memory[memoryPointer] = ((memory[memoryPointer] || 0) + 255) % 256,
    '.': () => output.push(memory[memoryPointer]),
    ',': () => memory[memoryPointer] = (input[inputPointer++] || '').charCodeAt(0),
    '[': () => !memory[memoryPointer] ? codePointer = loops[codePointer] : loop(codePointer, loops[codePointer]),
    ']': () => {},
  }

  while (codePointer < code.length) {
    command[code[codePointer]]()
    codePointer++
  }

  return String.fromCharCode.apply(null, output)
}

const main = async () => {
  const args = process.argv.slice(2)

  if (args.length !== 1) {
    return console.error('Expected format: node brain-fuck.js <brain fuck code>')
  }

  const code = args[0]
  let input = null

  if (args[0].includes(',')) {
    input = await new Promise(resolve => rl.question('Expecting input: ', input => resolve(input)))
    input = input.replace(/\\n/g, '\n')
  }

  console.log(brain_fuck(code, input))

  rl.close()
}

main()
