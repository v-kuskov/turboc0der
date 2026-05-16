import * as fs from 'fs';
import * as path from 'path';

const PLAN_PATH = path.join('.pi', 'plan', 'current.json');

enum PlanState {
    Planned,
    Running,
    Done
}

class PlanItem {
    description: string | undefined = undefined;
    state: PlanState = PlanState.Planned;
}

class WrongPlanState extends Error {
    private expected: PlanState;
    private got: PlanState;

    constructor(expected: PlanState, got: PlanState) {
        super("Expected ${expec} Got {got}")
        this.expected = expected;
        this.got = got;
        Error.call(this, this.message);
        Object.setPrototypeOf(this, WrongPlanState.prototype);
    }
}

export class Plan {
    items: PlanItem[] = []

    constructor(steps: string[]) {
        steps.forEach((step, _) => {
            let planItem = new PlanItem();
            planItem.description = step;
            this.items.push(planItem);
        });
    }

    public next_step(): Plan {
        var item = this.get_current_plan_item();
        if (item === undefined) {
            return this;
        }
        if (item.state != PlanState.Planned) {
            throw new WrongPlanState(PlanState.Planned, item.state);
        }
        item.state = PlanState.Running;
        return this;
    }

    public finish_step(): Plan {
        var item = this.get_current_plan_item();
        if (item === undefined) {
            return this;
        }
        if (item.state != PlanState.Running) {
            throw new WrongPlanState(PlanState.Running, item.state);
        }
        item.state = PlanState.Done;
        return this;
    }

    public get_current_step(): string | undefined {
        return this.get_current_plan_item()?.description;
    }

    public is_finished(): boolean {
        return this.get_current_plan_item() === undefined;
    }

    private get_current_plan_item(): PlanItem | undefined {
        if (this.items.length == 0) {
            return undefined;
        }
        for (var i in this.items) {
            if (this.items[i].state == PlanState.Planned || this.items[i].state == PlanState.Running) {
                return this.items[i]
            }
        }
        return undefined;
    }

    public save(): void {
        const dir = path.dirname(PLAN_PATH);
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }

        if (this.is_finished()) {
            if (fs.existsSync(PLAN_PATH)) {
                fs.unlinkSync(PLAN_PATH);
            }
            return;
        }

        const data = JSON.stringify({ items: this.items });
        fs.writeFileSync(PLAN_PATH, data, 'utf-8');
    }
}

export function get_current_plan(): Plan | undefined {
    if (!fs.existsSync(PLAN_PATH)) {
        return undefined;
    }

    const raw = fs.readFileSync(PLAN_PATH, 'utf-8');
    const data = JSON.parse(raw);

    if (!data.items || !Array.isArray(data.items)) {
        return undefined;
    }

    const plan = new Plan([]);
    plan.items = data.items.map((item: any) => {
        const planItem = new PlanItem();
        planItem.description = item.description ?? undefined;
        planItem.state = item.state ?? PlanState.Planned;
        return planItem;
    });

    if (plan.is_finished()) {
        fs.unlinkSync(PLAN_PATH);
        return undefined;
    }

    return plan;
}