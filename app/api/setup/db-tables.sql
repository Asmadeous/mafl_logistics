-- Create notifications table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.user_notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT DEFAULT 'info', -- info, success, warning, error
  link TEXT, -- Optional URL to redirect when clicked
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create user messages table for chat functionality 
CREATE TABLE IF NOT EXISTS public.user_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  receiver_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  content TEXT NOT NULL,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create table to track user online status
CREATE TABLE IF NOT EXISTS public.user_status (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'offline', -- online, away, offline
  last_active TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- RLS Policies for notifications
ALTER TABLE public.user_notifications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own notifications" 
  ON public.user_notifications FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can create notifications" 
  ON public.user_notifications FOR INSERT 
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM auth.users 
      WHERE id = auth.uid() AND raw_user_meta_data->>'role' = 'admin'
    )
  );

-- RLS Policies for messages
ALTER TABLE public.user_messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view messages they sent or received" 
  ON public.user_messages FOR SELECT 
  USING (sender_id = auth.uid() OR receiver_id = auth.uid());

CREATE POLICY "Users can send messages" 
  ON public.user_messages FOR INSERT 
  WITH CHECK (sender_id = auth.uid());

-- RLS Policies for user status
ALTER TABLE public.user_status ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can update their own status" 
  ON public.user_status FOR ALL
  USING (user_id = auth.uid());

CREATE POLICY "Anyone can view user status" 
  ON public.user_status FOR SELECT 
  USING (true);

-- Create function to update user last active timestamp
CREATE OR REPLACE FUNCTION update_last_active()
RETURNS TRIGGER AS $$
BEGIN
  NEW.last_active = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to update last active on status change
CREATE TRIGGER update_last_active_trigger
BEFORE UPDATE ON public.user_status
FOR EACH ROW
EXECUTE FUNCTION update_last_active();

-- Create function to mark notifications as read
CREATE OR REPLACE FUNCTION mark_notification_read(notification_id UUID)
RETURNS BOOLEAN AS $$
DECLARE
  success BOOLEAN;
BEGIN
  UPDATE public.user_notifications 
  SET is_read = true 
  WHERE id = notification_id AND user_id = auth.uid();
  
  GET DIAGNOSTICS success = ROW_COUNT;
  RETURN success > 0;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to mark messages as read
CREATE OR REPLACE FUNCTION mark_message_read(message_id UUID)
RETURNS BOOLEAN AS $$
DECLARE
  success BOOLEAN;
BEGIN
  UPDATE public.user_messages 
  SET is_read = true 
  WHERE id = message_id AND receiver_id = auth.uid();
  
  GET DIAGNOSTICS success = ROW_COUNT;
  RETURN success > 0;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
