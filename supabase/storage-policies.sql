-- Create public bucket for tracks if missing
insert into storage.buckets (id, name, public)
values ('tracks', 'tracks', true)
on conflict (id) do update set public = excluded.public;

create policy "Public can read tracks"
on storage.objects
for select
using (bucket_id = 'tracks');

create policy "Users can upload own tracks"
on storage.objects
for insert
to authenticated
with check (
  bucket_id = 'tracks'
  and (storage.foldername(name))[1] = auth.uid()::text
);

create policy "Users can update own tracks"
on storage.objects
for update
to authenticated
using (bucket_id = 'tracks' and owner = auth.uid())
with check (bucket_id = 'tracks' and owner = auth.uid());

create policy "Users can delete own tracks"
on storage.objects
for delete
to authenticated
using (bucket_id = 'tracks' and owner = auth.uid());
