async function wait(s) {
    const S_TO_MS = 1000
    return new Promise((r) => setTimeout(r, s * 1000));
}

export { wait };