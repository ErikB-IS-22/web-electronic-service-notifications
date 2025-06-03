import os
from watchdog.observers import Observer
from watchdog.events import FileSystemEventHandler
from minio import Minio

minio_client = Minio(
    "minio.example.com:9000",
    access_key='minio', #os.environ.get('MINIO_ACCESS_KEY'),
    secret_key='minio123', #os.environ.get('MINIO_SECRET_KEY'),
    secure=False
)

bucket_name = "images"
folder_to_watch = "media/services/services"

class MinioUploadHandler(FileSystemEventHandler):
    def on_created(self, event):
        if not event.is_directory:
            file_path = event.src_path
            object_name = os.path.relpath(file_path, "media")
            try:
                minio_client.fput_object(
                    bucket_name, object_name, file_path
                )
                print(f"Uploaded {file_path} to Minio")
            except Exception as e:
                print(f"Error uploading {file_path}: {e}")

if __name__ == "__main__":
    event_handler = MinioUploadHandler()
    observer = Observer()
    observer.schedule(event_handler, folder_to_watch, recursive=True)
    observer.start()
    print(f"Watching {folder_to_watch} for changes...")
    try:
        while True:
            pass
    except KeyboardInterrupt:
        observer.stop()
    observer.join()