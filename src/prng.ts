/**
 * Pseudo-random number generator
 *  - Credit: @Blixt, https://gist.github.com/blixt/f17b47c62508be59987b
 */
export class PRNG {
  private seed: number;

  /**
   * Instantiate a new pseudo-random number generator with random or given seed
   */
  constructor(seed: number = Math.random() * 2147483647) {
    this.seed = seed % 2147483647;
    if (this.seed <= 0) this.seed += 2147483646;
  }

  /**
   * Generate a pseudo-random number between 1 and 2^32 - 2
   */
  public next(): number {
    return this.seed = this.seed * 16807 % 2147483647;
  }

  /**
   * Generate a pseudo-random float between 0 and 1
   */
  public nextFloat(): number {
    return (this.next() - 1) / 2147483646;
  }
}
