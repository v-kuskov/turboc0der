import * as fs from 'fs';
import * as path from 'path';
import { Plan, get_current_plan } from '../src/plan';

const PLAN_PATH = path.join('.pi', 'plan', 'current.json');

beforeEach(() => {
    if (fs.existsSync(PLAN_PATH)) {
        fs.unlinkSync(PLAN_PATH);
    }
});

afterEach(() => {
    if (fs.existsSync(PLAN_PATH)) {
        fs.unlinkSync(PLAN_PATH);
    }
});

describe('Plan.save()', () => {
    it('writes plan file for unfinished plan', () => {
        const plan = new Plan(['step 1', 'step 2']);
        plan.save();

        expect(fs.existsSync(PLAN_PATH)).toBe(true);
        const raw = fs.readFileSync(PLAN_PATH, 'utf-8');
        const data = JSON.parse(raw);
        expect(data.items).toHaveLength(2);
        expect(data.items[0].description).toBe('step 1');
        expect(data.items[0].state).toBe(0); // Planned
        expect(data.items[1].description).toBe('step 2');
        expect(data.items[1].state).toBe(0); // Planned
    });

    it('erases plan file for finished plan', () => {
        const plan = new Plan(['step 1']);
        plan.next_step();
        plan.finish_step();

        // save before — file exists
        plan.save();
        expect(fs.existsSync(PLAN_PATH)).toBe(false);
    });

    it('erases plan file for empty plan', () => {
        const plan = new Plan([]);

        // Write file first
        fs.mkdirSync(path.dirname(PLAN_PATH), { recursive: true });
        fs.writeFileSync(PLAN_PATH, '{}', 'utf-8');

        plan.save();
        expect(fs.existsSync(PLAN_PATH)).toBe(false);
    });

    it('creates directory if missing', () => {
        // Ensure dir doesn't exist
        if (fs.existsSync(path.dirname(PLAN_PATH))) {
            fs.rmSync(path.dirname(PLAN_PATH), { recursive: true });
        }

        const plan = new Plan(['only step']);
        plan.save();

        expect(fs.existsSync(PLAN_PATH)).toBe(true);
    });

    it('overwrites existing file with current state', () => {
        const plan = new Plan(['a', 'b', 'c']);
        plan.save();

        plan.next_step(); // mark 'a' as Running
        plan.save();

        const raw = fs.readFileSync(PLAN_PATH, 'utf-8');
        const data = JSON.parse(raw);
        expect(data.items[0].state).toBe(1); // Running
        expect(data.items[1].state).toBe(0); // Planned
    });
});

describe('get_current_plan()', () => {
    it('returns undefined when no plan file', () => {
        expect(get_current_plan()).toBeUndefined();
    });

    it('returns plan from file', () => {
        const plan = new Plan(['alpha', 'beta']);
        plan.save();

        const loaded = get_current_plan();
        expect(loaded).toBeDefined();
        expect(loaded!.items).toHaveLength(2);
        expect(loaded!.get_current_step()).toBe('alpha');
    });

    it('preserves Running state after load', () => {
        const plan = new Plan(['x', 'y']);
        plan.next_step(); // 'x' -> Running
        plan.save();

        const loaded = get_current_plan();
        expect(loaded!.get_current_step()).toBe('x');
        loaded!.finish_step();
        expect(loaded!.get_current_step()).toBe('y');
    });

    it('returns undefined and erases file for finished plan', () => {
        const plan = new Plan(['done']);
        plan.next_step();
        plan.finish_step();
        plan.save();

        expect(fs.existsSync(PLAN_PATH)).toBe(false);
        expect(get_current_plan()).toBeUndefined();
    });

    it('returns undefined for malformed data', () => {
        fs.mkdirSync(path.dirname(PLAN_PATH), { recursive: true });
        fs.writeFileSync(PLAN_PATH, '{"not_items": []}', 'utf-8');

        expect(get_current_plan()).toBeUndefined();
    });

    it('returns undefined for non-array items', () => {
        fs.mkdirSync(path.dirname(PLAN_PATH), { recursive: true });
        fs.writeFileSync(PLAN_PATH, '{"items": "not-an-array"}', 'utf-8');

        expect(get_current_plan()).toBeUndefined();
    });

    it('restores plan with all items Done', () => {
        const plan = new Plan(['one', 'two']);
        plan.next_step();
        plan.finish_step();
        plan.next_step();
        plan.finish_step();
        plan.save();

        // File should be erased by save() since it's finished
        expect(fs.existsSync(PLAN_PATH)).toBe(false);
        expect(get_current_plan()).toBeUndefined();
    });
});
