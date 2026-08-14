import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm';

export const topics = sqliteTable('topics', {
  id: text('id').primaryKey(),
  title: text('title').notNull(),
  type: text('type').default('thesis').notNull(),
  answer: text('answer'),
  createdAt: integer('created_at', { mode: 'timestamp' }).default(sql`(strftime('%s', 'now'))`),
});

export const sources = sqliteTable('sources', {
  id: text('id').primaryKey(),
  topicId: text('topic_id').notNull().references(() => topics.id),
  title: text('title').notNull(),
  url: text('url').notNull(),
  snippet: text('snippet').notNull(),
  stance: text('stance').notNull(), // 'pro', 'con', 'neutral'
});
