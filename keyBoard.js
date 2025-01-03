import { Markup } from 'telegraf';

export function getMainMenu() {
  return Markup.keyboard([
    ["Add repetitions"],
  ])
  .resize()
  .oneTime(false); 
}

