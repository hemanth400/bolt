# Skill Friend - Setup Guide

This guide will help you set up the Skill Friend learning platform with Supabase backend to fix the database error during account creation.

> **Currently Running in Demo Mode**: The app is displaying sample data and disabled authentication. Follow this guide to enable full functionality.

## 🚀 Quick Setup

### 1. Supabase Setup

**Step 1: Create a Supabase Project**
1. Go to [Supabase](https://supabase.com) and create a new project
2. Wait for the project to be ready (usually takes 2-3 minutes)

**Step 2: Get Your Credentials**
1. Go to Settings → API in your Supabase dashboard
2. Copy your `Project URL` and `anon public` key

**Step 3: Update Environment Variables**

**Option A: Using Builder.io Interface**
1. In the Builder.io interface, look for environment variable settings
2. Set `VITE_SUPABASE_URL` to your Supabase project URL
3. Set `VITE_SUPABASE_ANON_KEY` to your Supabase anon key
4. Restart the development server

**Option B: Using DevServerControl (if available)**
```bash
# Set your Supabase URL (replace with your actual URL)
VITE_SUPABASE_URL=https://your-project-ref.supabase.co

# Set your Supabase anon key (replace with your actual key)
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

**Option C: Manual .env file**
Create a `.env` file in the root directory:
```env
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

### 2. Database Schema Setup

Copy and run this SQL in your Supabase SQL Editor:

```sql
-- Enable RLS (Row Level Security)
alter table auth.users enable row level security;

-- Create profiles table
create table public.profiles (
    id uuid references auth.users(id) on delete cascade primary key,
    email text not null,
    full_name text,
    points integer default 0,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create courses table
create table public.courses (
    id uuid default gen_random_uuid() primary key,
    title text not null,
    description text not null,
    price numeric(10,2) default 0,
    image_url text,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create games table
create table public.games (
    id uuid default gen_random_uuid() primary key,
    title text not null,
    description text not null,
    icon text default '🎮',
    points_reward integer default 100,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create enrollments table
create table public.enrollments (
    id uuid default gen_random_uuid() primary key,
    user_id uuid references auth.users(id) on delete cascade not null,
    course_id uuid references public.courses(id) on delete cascade not null,
    enrolled_at timestamp with time zone default timezone('utc'::text, now()) not null,
    unique(user_id, course_id)
);

-- Create leaderboard view
create view public.leaderboard as
select 
    p.id,
    p.full_name,
    p.points
from public.profiles p
order by p.points desc;

-- RLS Policies for profiles
create policy "Users can view their own profile" on public.profiles
    for select using (auth.uid() = id);

create policy "Users can update their own profile" on public.profiles
    for update using (auth.uid() = id);

create policy "Anyone can view leaderboard" on public.profiles
    for select using (true);

-- RLS Policies for courses
create policy "Anyone can view courses" on public.courses
    for select using (true);

-- RLS Policies for games
create policy "Anyone can view games" on public.games
    for select using (true);

-- RLS Policies for enrollments
create policy "Users can view their own enrollments" on public.enrollments
    for select using (auth.uid() = user_id);

create policy "Users can create their own enrollments" on public.enrollments
    for insert with check (auth.uid() = user_id);

-- Enable RLS on all tables
alter table public.profiles enable row level security;
alter table public.courses enable row level security;
alter table public.games enable row level security;
alter table public.enrollments enable row level security;

-- Function to award points
create or replace function award_points(user_id_in uuid, points_in integer, description_in text)
returns void
language plpgsql
security definer
as $$
begin
    update public.profiles
    set points = points + points_in,
        updated_at = now()
    where id = user_id_in;
end;
$$;

-- Function to automatically create profile on signup
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
    insert into public.profiles (id, email, full_name)
    values (
        new.id,
        new.email,
        coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1))
    );
    return new;
end;
$$;

-- Trigger to create profile automatically
create trigger on_auth_user_created
    after insert on auth.users
    for each row execute procedure public.handle_new_user();

-- Insert sample data
insert into public.courses (title, description, price, image_url) values
('React Fundamentals', 'Learn the basics of React development with hands-on projects.', 99.00, 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400&h=250&fit=crop'),
('JavaScript Mastery', 'Master modern JavaScript with ES6+ features and best practices.', 149.00, 'https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=400&h=250&fit=crop'),
('Full Stack Development', 'Build complete web applications from frontend to backend.', 199.00, 'https://images.unsplash.com/photo-1587620962725-abab7fe55159?w=400&h=250&fit=crop');

insert into public.games (title, description, icon, points_reward) values
('Code Challenge', 'Solve coding problems and earn points!', '💻', 100),
('Algorithm Race', 'Race against time to solve algorithms.', '⚡', 150),
('Debug Master', 'Find and fix bugs in the code.', '🔍', 120);
```

### 3. Authentication Setup

The app includes:
- ✅ Secure user authentication with Supabase Auth
- ✅ Automatic profile creation on signup
- ✅ Password validation with requirements
- ✅ Error handling for database operations
- ✅ Row-level security for data protection

### 4. Test the Setup

1. Restart your development server if needed
2. The setup notice should disappear and you'll see the login screen
3. Try creating a new account
4. The database error should now be resolved!

### 5. Verify Everything Works

- ✅ Setup notice is gone
- ✅ Authentication forms are displayed
- ✅ Account creation works without errors
- ✅ Login/logout functionality works
- ✅ Courses and games load from your database
- ✅ Points system and leaderboard function

## 🔧 Troubleshooting

### Common Issues:

**1. "Missing Supabase environment variables" error:**
- Make sure you've set both `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`
- Restart the development server after setting environment variables

**2. "Profile creation failed" error:**
- Ensure you've run the database schema SQL in Supabase
- Check that RLS policies are properly configured
- Verify the trigger `on_auth_user_created` exists

**3. "Permission denied" errors:**
- Make sure RLS policies are correctly set up
- Check that the `handle_new_user()` function has `security definer` permissions

**4. No courses/games showing:**
- Verify the sample data was inserted successfully
- Check the RLS policies allow public read access

## 🎯 Features Included

- **Authentication System**: Secure signup/login with Supabase Auth
- **User Profiles**: Automatic profile creation with points tracking
- **Course Management**: Browse and enroll in courses
- **Gamification**: Play games and earn points
- **Leaderboard**: Compete with other learners
- **Dark/Light Mode**: Theme switching
- **Responsive Design**: Works on all devices

## 📝 Database Schema

The database includes these main tables:
- `profiles` - User profiles with points
- `courses` - Learning courses
- `games` - Coding games
- `enrollments` - Course enrollments
- `leaderboard` - Points ranking view

All tables have proper RLS policies for security.

## 🚀 Next Steps

After setup, you can:
1. Add more courses and games through Supabase dashboard
2. Customize the UI and branding
3. Add more features like videos, quizzes, etc.
4. Deploy to production using Netlify or Vercel

## 🛠️ Technical Stack

- **Frontend**: React 18 + TypeScript + Tailwind CSS
- **Backend**: Supabase (PostgreSQL + Auth + Storage)
- **UI Components**: Radix UI + Shadcn/ui
- **State Management**: React Context + TanStack Query
- **Build Tool**: Vite
- **Package Manager**: pnpm

---

Need help? Check the [Supabase Documentation](https://supabase.com/docs) or create an issue in the repository.
