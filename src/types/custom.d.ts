import { Context, NarrowedContext } from "telegraf";
import { CallbackQuery, Chat, Message, Update } from "telegraf/types";

type Enumerate<N extends number, Acc extends number[] = []> = Acc['length'] extends N
  ? Acc[number]
  : Enumerate<N, [...Acc, Acc['length']]>;

export type IntRange<F extends number, T extends number> = Exclude<Enumerate<T>, Enumerate<F>>;

export type TextMessageCtx = NarrowedContext<Context, Update.MessageUpdate<Message.TextMessage>>;
export type CallbackQueryCtx = NarrowedContext<Context & { match: RegExpExecArray }, Update.CallbackQueryUpdate<CallbackQuery>>;
export type TgGroupChat = Chat.GroupGetChat | Chat.SupergroupGetChat | Chat.ChannelGetChat;