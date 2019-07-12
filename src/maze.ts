import { PRNG } from './prng';

export class Maze {
  /**
   * Pseudo-random number generator is used for deterministic generation
   */
  private prng: PRNG;

  /**
   * All cells within a square maze are stored in a single-dimensional array
   *  - Get a cell value using (y * size) + x
   */
  private cells: ICell[];

  /**
   * Maze map size (square)
   */
  private size: number;

  /**
   * Instantiate a new maze
   */
  constructor(size: number = 16, seed = Math.random() * 2147483647) {
    // New empty cell map
    this.size = size;
    this.cells = new Array<ICell>(size * size);
    for (let i = 0; i < size * size; i++) {
      this.cells[i] = {
        n: true,
        e: true,
        s: true,
        w: true,
        visited: false,
      };
    }

    // Init PRNG
    this.prng = new PRNG(seed);

    // Generate maze
    this.generate(0, 0);
  }

  /**
   * Get maze cell data
   */
  public get maze(): ICell[] {
    return this.cells;
  }

  /**
   * Draw maze diagram to a string
   */
  public diagram(): string {
    // Build diagram string
    let diagram = '';
    for (let y = 0; y < this.size; y++) {
      for (let x = 0; x < this.size; x++) {
        // Get cell at [x,y]
        const cell = this.getCell(x, y);

        // Diagram character for this cell
        const charKey = `${cell.n ? '1' : '0'}${cell.e ? '1' : '0'}${cell.s ? '1' : '0'}${cell.w ? '1' : '0'}`;
        diagram += cellAtlas.get(charKey);
      }
      if (y < this.size - 1) diagram += '\n';
    }

    return diagram;
  }

  /**
   * Get cell value at given coordinates
   */
  public getCell(x: number, y: number): ICell {
    return this.cells[y * this.size + x];
  }

  /**
   * Set cell value(s) at given coordinates
   *  - Uses `Object.assign()` to merge new values
   */
  private setCell(x: number, y: number, newValues: ICell): void {
    Object.assign(this.cells[y * this.size + x], newValues);
  }

  /**
   * Determine if given cell has been visited
   */
  private isVisited(x: number, y: number): boolean {
    if (!this.inBounds(x, y)) return true;
    return this.getCell(x, y).visited;
  }

  /**
   * Determine if given point is in the maze map bounds
   */
  private inBounds(x: number, y: number): boolean {
    return (
      x >= 0 &&
      y >= 0 &&
      x < this.size &&
      y < this.size
    );
  }

  /**
   * Recursively generate maze cell data
   */
  private generate(x: number, y: number): void {
    // Visited
    this.setCell(x, y, { visited: true });

    // Get random directions
    const directions: Direction[] = this.randomDirections();

    // Move about
    while (directions.length) {
      // Get next direction
      const nextDirection: Direction = directions.shift();

      // North
      if (nextDirection === Direction.North && !this.isVisited(x, y - 1)) {
        this.setCell(x, y, { n: false });
        this.setCell(x, y - 1, { s: false });
        this.generate(x, y - 1);
      }

      // East
      else if (nextDirection === Direction.East && !this.isVisited(x + 1, y)) {
        this.setCell(x, y, { e: false });
        this.setCell(x + 1, y, { w: false });
        this.generate(x + 1, y);
      }

      // South
      else if (nextDirection === Direction.South && !this.isVisited(x, y + 1)) {
        this.setCell(x, y, { s: false });
        this.setCell(x, y + 1, { n: false });
        this.generate(x, y + 1);
      }

      // West
      else if (nextDirection === Direction.West && !this.isVisited(x - 1, y)) {
        this.setCell(x, y, { w: false });
        this.setCell(x - 1, y, { e: false });
        this.generate(x - 1, y);
      }
    }
  }

  /**
   * Generate a new set of random directions
   */
  private randomDirections(): Direction[] {
    // Possible directions
    const directions: Direction[] = [
      Direction.North,
      Direction.East,
      Direction.South,
      Direction.West,
    ];

    // Shuffle
    const shuffled: Direction[] = [];
    while (directions.length) {
      const randomIndex: number = Math.floor(this.prng.nextFloat() * directions.length);
      shuffled.push(directions.splice(randomIndex, 1)[0]);
    }

    return shuffled;
  }
}

interface ICell {
  n?: boolean;
  e?: boolean;
  s?: boolean;
  w?: boolean;
  visited?: boolean;
}

enum Direction {
  North = 0,
  East = 1,
  South = 2,
  West = 3,
}

/**
 * There are 16 possible combinations of cell configurations
 *  - This map defines the character to be output for each possible combination
 */
const cellAtlas: Map<string, string> = new Map<string, string>([
  ['0000', ' '],
  ['0001', '⎸'],
  ['0010', '⎽'],
  ['0011', '└'],
  ['0100', '⎹'],
  ['0101', '║'],
  ['0110', '┘'],
  ['0111', '⼐'],
  ['1000', '⎺'],
  ['1001', '┌'],
  ['1010', '═'],
  ['1011', '⫍'],
  ['1100', '┐'],
  ['1101', '⼌'],
  ['1110', '⫎'],
  ['1111', '█'],
]);
