import React, { useState } from 'react';
import { Upload, SendHorizonal, Smile, Trash2, Mic } from 'lucide-react';
import EmojiPicker, { EmojiClickData } from 'emoji-picker-react';
import { useSelector, useDispatch } from 'react-redux';
import { AppDispatch, RootState } from '../../../redux/store';
import socket from '../../../utils/socket';
import { Message } from '../../../redux/slice/types';
import { fileIcons } from '../../../assets';
import { incrementUnreadCount, transcribeAudio } from '../../../redux/slice/chatSlice';
import { useReactMediaRecorder } from 'react-media-recorder';
import { toast } from 'react-toastify';

const ChatInput: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [message, setMessage] = useState('');
  const [isEmojiPickerOpen, setEmojiPickerOpen] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  const [isVoicePanelOpen, setIsVoicePanelOpen] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);

  const [isTranscribing, setIsTranscribing] = useState(false);

  const userDetail = useSelector((state: RootState) => state.auth.userDetail);
  const selectedConversation = useSelector((state: RootState) => state.chat.selectedConversation);

  const { startRecording, stopRecording, clearBlobUrl } = useReactMediaRecorder({
    audio: true,
    onStop: (_, blob: Blob) => {
      setAudioBlob(blob);
    }
  });

  const handleSendVoice = async () => {
    if (!selectedConversation || !userDetail || !audioBlob) return;

    const audioFile = new File([audioBlob], "voice-message.webm", { type: "audio/webm" });

    const base64 = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(audioFile);
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = reject;
    });

    const voiceMessage: Message = {
      conversationId: selectedConversation._id,
      senderId: userDetail.userId,
      name: `${userDetail.firstname} ${userDetail.lastname}`,
      content: base64,
      type: 'audio',
      timestamp: new Date().toISOString(),
      isDeleted: false,
      isSentByUser: true,
      isPinned: false,
      senderAvatar: userDetail?.avatar,
      fileName: 'voice-message.webm',
      fileType: 'audio/webm',
    };

    socket.emit('sendMessage', voiceMessage);

    selectedConversation.members.forEach(member => {
      if (member.userId !== userDetail.userId) {
        dispatch(incrementUnreadCount({ userId: member.userId, conversationId: selectedConversation._id }));
      }
    });

    setAudioBlob(null);
    setIsVoicePanelOpen(false);
    setIsRecording(false);
    clearBlobUrl();
  };

  const handleTranscribe = async () => {
    if (!audioBlob) {
      toast.error("No audio available to transcribe");
      return;
    }

    setIsTranscribing(true);

    // Tạo file từ blob
    const audioFile = new File([audioBlob], "voice-message.wav", { type: "audio/wav" });

    // Chuyển file thành base64
    const base64 = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(audioFile);
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = reject;
    });

    try {
      const result = await dispatch(transcribeAudio(base64)).unwrap();
      setMessage(result); // Gán văn bản chuyển đổi vào ô nhập tin nhắn
      toast.success("Voice transcribed to text");
    } catch (err) {
      console.error("Error transcribing audio:", err);
      toast.error("Failed to transcribe audio");
    } finally {
      setIsTranscribing(false);
    }
  };





  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSend();
    }
  };

  const handleSend = async () => {
    if (!selectedConversation?._id) {
      console.error('No conversation selected');
      return;
    }

    if (!userDetail) {
      console.error('No user detail found');
      return;
    }

    if (message.trim()) {
      const textMessage: Message = {
        conversationId: selectedConversation._id,
        senderId: userDetail.userId,
        name: `${userDetail.firstname} ${userDetail.lastname}`,
        content: message.trim(),
        type: "text",
        timestamp: new Date().toISOString(),
        isDeleted: false,
        isSentByUser: true,
        isPinned: false,
        senderAvatar: userDetail?.avatar,
      };

      socket.emit('sendMessage', textMessage);

      // ✅ Tăng unreadCount cho các thành viên còn lại
      selectedConversation.members.forEach(member => {
        if (member.userId !== userDetail.userId) {
          dispatch(incrementUnreadCount({
            userId: member.userId,
            conversationId: selectedConversation._id,
          }));
        }
      });

    }

    // Gửi từng file theo thứ tự
    for (const file of selectedFiles) {
      const fileType = file.type.split('/')[0];
      let messageType: "image" | "video" | "audio" | "file" = "file";

      if (fileType === "image") messageType = "image";
      else if (fileType === "video") messageType = "video";
      else if (fileType === "audio") messageType = "audio";

      const fileContent = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onloadend = () => resolve(reader.result as string);
        reader.onerror = reject;
      });

      const fileMessage: Message = {
        conversationId: selectedConversation._id,
        senderId: userDetail.userId,
        name: `${userDetail.firstname} ${userDetail.lastname}`,
        content: fileContent,
        type: messageType,
        timestamp: new Date().toISOString(),
        isDeleted: false,
        isSentByUser: true,
        isPinned: false,
        senderAvatar: userDetail?.avatar,
        fileName: file.name,
        fileType: file.type,
      };

      socket.emit('sendMessage', fileMessage);

      // ✅ Tăng unreadCount cho file gửi đi
      selectedConversation.members.forEach(member => {
        if (member.userId !== userDetail.userId) {
          dispatch(incrementUnreadCount({
            userId: member.userId,
            conversationId: selectedConversation._id,
          }));
        }
      });

    }

    // Xoá nội dung sau khi gửi xong
    setMessage('');
    setSelectedFiles([]);
  };


  const handleEmojiClick = (emojiObject: EmojiClickData) => {
    setMessage((prevMessage) => prevMessage + emojiObject.emoji);
    setEmojiPickerOpen(false);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);

      const newFiles = [...selectedFiles, ...filesArray];

      if (newFiles.length > 8) {
        toast.error("You can only send up to 8 files at a time", {
          toastId: "file-limit",
        });
        return;
      }

      setSelectedFiles(newFiles);
    }
  };

  const handleRemoveFile = (fileIndex: number) => {
    setSelectedFiles(prev => prev.filter((_, index) => index !== fileIndex));
  };

  const handleRemoveAllFiles = () => {
    setSelectedFiles([]); // Xóa tất cả ảnh
  };

  const isImageFile = (file: File) => {
    return file.type.startsWith("image/");
  };

  const getFileIcon = (fileName: string = '') => {
    const ext = fileName.split('.').pop()?.toLowerCase();

    if (!ext) return fileIcons.doc; // fallback

    switch (ext) {
      case 'pdf':
        return fileIcons.pdf;
      case 'doc':
      case 'docx':
        return fileIcons.doc;
      case 'xls':
      case 'xlsx':
        return fileIcons.xls;
      case 'zip':
      case 'rar':
        return fileIcons.zip;
      case 'png':
      case 'jpg':
      case 'jpeg':
      case 'gif':
        return fileIcons.image;
      case 'mp4':
      case 'mov':
      case 'avi':
        return fileIcons.video;
      case 'mp3':
      case 'wav':
        return fileIcons.sound;
      default:
        return fileIcons.doc;
    }
  };

  return (
    <div className="p-3 bg-[#282828b2] flex flex-col rounded-xl">

      {/* Voice recording panel giống Zalo */}
      {isVoicePanelOpen && (
        <div className="mb-2 bg-[#1f1f1f] p-3 rounded-lg flex items-center gap-4 text-white">
          <div className="flex items-center gap-4">
            {!isRecording ? (
              <button
                onClick={() => {
                  startRecording();
                  setIsRecording(true);
                }}
                className="bg-gray-700 px-4 py-2 rounded hover:bg-gray-600 cursor-pointer"
              >
                🎙️ Start Recording
              </button>
            ) : (
              <button
                onClick={() => {
                  stopRecording();
                  setIsRecording(false);
                }}
                className="bg-yellow-600 px-4 py-2 rounded hover:bg-yellow-500 cursor-pointer"
              >
                ⏹️ Stop Recording
              </button>
            )}

            <button
              onClick={handleSendVoice}
              disabled={!audioBlob}
              className={`px-4 py-2 rounded ${audioBlob ? 'bg-green-600 hover:bg-green-500 cursor-pointer' : 'bg-gray-500 cursor-not-allowed'}`}
            >
              ✅ Send
            </button>

            <button
              onClick={handleTranscribe}
              disabled={!audioBlob || isTranscribing}
              className={`px-4 py-2 rounded ${audioBlob && !isTranscribing ? 'bg-blue-600 hover:bg-blue-500 cursor-pointer' : 'bg-gray-500 cursor-not-allowed'}`}
            >
              {isTranscribing ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="white" strokeWidth="4" fill="none" />
                    <path
                      className="opacity-75"
                      fill="white"
                      d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                    />
                  </svg>
                  Processing...
                </span>
              ) : (
                <>📝 To Text</>
              )}
            </button>

            <button
              onClick={() => {
                stopRecording();
                setAudioBlob(null);
                setIsVoicePanelOpen(false);
                setIsRecording(false);
                clearBlobUrl();
              }}
              className="bg-red-600 px-4 py-2 rounded hover:bg-red-500 cursor-pointer"
            >
              ❌ Cancel
            </button>
          </div>

          {/* 👉 THÊM audio preview ở đây */}
          {audioBlob && (
            <audio controls src={URL.createObjectURL(audioBlob)} className="w-full max-w-[34%] h-[100%] rounded" />
          )}
        </div>
      )}

      <div className='p-3 bg-[#282828b2] flex items-center rounded-xl w-full'>
        {/* Nút Upload */}
        <input type="file" className="hidden" id="fileInput" multiple onChange={handleFileChange} />
        <label htmlFor="fileInput" className="cursor-pointer">
          <Upload size={20} className="text-white" />
        </label>

        {/* Voice icon mở panel */}
        <button onClick={() => setIsVoicePanelOpen(prev => !prev)} className="ml-2 text-white cursor-pointer">
          <Mic size={20} />
        </button>

        {/* Input text with Emoji button inside */}
        <div className="relative flex-1 mx-2 w-full">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type a message..."
            className="w-full p-2 pl-2 pr-10 rounded-xl bg-[#1212124C]/50 text-white focus:outline-none "
          />

          {/* Emoji button inside input */}
          <button
            className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer"
            onClick={() => setEmojiPickerOpen(!isEmojiPickerOpen)}
          >
            <Smile size={18} className="text-white" />
          </button>

          {/* Emoji Picker */}
          {isEmojiPickerOpen && (
            <div className="absolute bottom-12 right-0 p-2 rounded-md shadow-md z-8 w-full max-w-sm overflow-hidden">
              <EmojiPicker onEmojiClick={handleEmojiClick} />
            </div>
          )}
        </div>

        {/* Nút gửi */}
        <button
          onClick={handleSend}
          className="bg-green-500 px-4 py-2 rounded-lg text-white flex items-center cursor-pointer"
        >
          <SendHorizonal size={20} />
        </button>
      </div>


      {/* Selected Files */}
      {selectedFiles.length > 0 && (
        <div className="mt-2 flex gap-2">
          <div className="flex flex-wrap gap-2">
            {selectedFiles.map((file, index) => {
              const isImage = isImageFile(file);
              const fileExtension = file.name.split('.').pop()?.toLowerCase() || '';
              const icon = getFileIcon(file.name);
              return (
                <div key={index} className="relative bg-gray-700 rounded-lg flex items-center gap-2 overflow-hidden max-w-[150px]">
                  {isImage ? (
                    <img
                      src={URL.createObjectURL(file)}
                      alt={file.name}
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                  ) : (
                    <img
                      src={icon}
                      alt="file-icon"
                      className="w-10 h-10 object-contain"
                    />
                  )}

                  {!isImage && (
                    <div className="flex-1 w-[110px]">
                      <p className="text-white text-sm truncate w-[86px]">
                        {file.name}
                      </p>
                      <p className="text-gray-400 text-xs uppercase">{fileExtension}</p>
                    </div>
                  )}
                  {/* Delete button inside image */}
                  <button
                    className="absolute top-0 right-0 text-red-500 not-only:rounded-full p-1 cursor-pointer"
                    onClick={() => handleRemoveFile(index)}
                  >
                    <Trash2 size={16} />

                  </button>
                </div>
              );
            })}
          </div>

          {/* Button to remove all files */}
          <button
            onClick={handleRemoveAllFiles}
            className="text-red-500 text-xs cursor-pointer ml-auto"
          >
            Remove all
          </button>
        </div>
      )}
    </div>
  );
};

export default ChatInput;