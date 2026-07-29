import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Expense, ExpenseDocument } from './entities/expense.entity';
import { CreateExpenseDto } from './dto/create-expense.dto';
import { UpdateExpenseDto } from './dto/update-expense.dto';

@Injectable()
export class ExpenseService {
  constructor(
    @InjectModel(Expense.name) private expenseModel: Model<ExpenseDocument>,
  ) {}

  // ✨ Naya expense create karta hai
  async create(createExpenseDto: CreateExpenseDto) {
  const created = new this.expenseModel({
    ...createExpenseDto,
    date: createExpenseDto.date ? new Date(createExpenseDto.date) : new Date(),
  });
  return created.save();
}

  // ✨ Sab expenses fetch karta hai — optional startDate/endDate filter k sath
  // agar dono ya koi ek date di jaye to usi range k records aayen gy, sath total b milega
  async findAll(startDate?: string, endDate?: string) {
    const filter: any = {};

    if (startDate || endDate) {
      filter.date = {};
      if (startDate) {
        const start = new Date(startDate);
        start.setHours(0, 0, 0, 0);
        filter.date.$gte = start;
      }
      if (endDate) {
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        filter.date.$lte = end;
      }
    }

    const expenses = await this.expenseModel
      .find(filter)
      .sort({ date: -1 })
      .exec();

    const total = expenses.reduce((sum, exp) => sum + Number(exp.amount || 0), 0);

    return {
      data: expenses,
      total,
      count: expenses.length,
    };
  }

  // ✨ Daily / Weekly / Monthly / Grand totals (hamesha sab records par based, filter se independent)
async getStats() {
  const now = new Date();

  // Aaj ka start aur end
  const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const endOfDay = new Date(startOfDay);
  endOfDay.setHours(23, 59, 59, 999);

  // Week ka start Monday se
  const dayOfWeek = now.getDay(); // 0 = Sunday
  const diffToMonday = (dayOfWeek + 6) % 7;
  const startOfWeek = new Date(now);
  startOfWeek.setDate(now.getDate() - diffToMonday);
  startOfWeek.setHours(0, 0, 0, 0);

  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  const allExpenses = await this.expenseModel.find().exec();

  let daily = 0;
  let weekly = 0;
  let monthly = 0;
  let grand = 0;

  for (const exp of allExpenses) {
    const amount = Number(exp.amount) || 0;

    // ✨ Agar date missing hai to is record ko skip kar dein
    if (!exp.date) {
      continue;
    }

    const expDate: Date = new Date(exp.date);

    // ✨ Invalid date (corrupt data) ko bhi skip karein
    if (isNaN(expDate.getTime())) {
      continue;
    }

    // Yahan se neeche TypeScript ko pata hai expDate ek valid Date hai, null nahi
    grand += amount;

    if (expDate >= startOfDay && expDate <= endOfDay) {
      daily += amount;
    }
    if (expDate >= startOfWeek) {
      weekly += amount;
    }
    if (expDate >= startOfMonth) {
      monthly += amount;
    }
  }

  return {
    dailyTotal: daily,
    weeklyTotal: weekly,
    monthlyTotal: monthly,
    grandTotal: grand,
  };
}

  async findOne(id: string) {
    const expense = await this.expenseModel.findById(id).exec();
    if (!expense) {
      throw new NotFoundException(`Expense with id ${id} not found`);
    }
    return expense;
  }

async update(id: string, updateExpenseDto: UpdateExpenseDto) {
  const updateData: any = { ...updateExpenseDto };
  if (updateExpenseDto.date) {
    updateData.date = new Date(updateExpenseDto.date);
  }

  const updated = await this.expenseModel
    .findByIdAndUpdate(id, updateData, { new: true })
    .exec();

  if (!updated) {
    throw new NotFoundException(`Expense with id ${id} not found`);
  }
  return updated;
}
  async remove(id: string) {
    const deleted = await this.expenseModel.findByIdAndDelete(id).exec();
    if (!deleted) {
      throw new NotFoundException(`Expense with id ${id} not found`);
    }
    return deleted;
  }
}