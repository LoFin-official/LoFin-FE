import React, { ReactNode, useState, useCallback } from 'react';
import BottomSheet from './BottomSheet';
import Calendar from 'react-calendar';

interface BottomSheetDateProps {
  className?: string;
  children?: ReactNode;
  isOpen: boolean;
  height: string;
  onClose: () => void;
  onSelectDate: (date: Date) => void;
  maxDate?: Date; // maxDate 추가
  minDate?: Date; // 새로 추가 (최소 날짜)
}

/** 캘린더 관련 타입 */
type DatePiece = Date | null;
type SelectedDate = DatePiece | [DatePiece, DatePiece];
export default function BottomSheetDate({
  className,
  isOpen,
  onClose,
  height,
  onSelectDate,
  minDate, // 추가
  maxDate, // 추가
}: BottomSheetDateProps) {
  const [selectedDate, setSelectedDate] = useState<SelectedDate>(new Date());

  // 날짜를 YYYY-MM-DD 형식으로 변환하는 함수
  const formatDateToString = useCallback((date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }, []);

  // 날짜 선택 핸들러
  const handleDateChange = useCallback(
    (date: SelectedDate) => {
      if (date instanceof Date) {
        // minDate / maxDate 검사
        if (minDate && date < minDate) {
          alert(`이전 날짜는 선택할 수 없습니다.`);
          return;
        }
        if (maxDate && date > maxDate) {
          alert(`이후 날짜는 선택할 수 없습니다.`);
          return;
        }

        setSelectedDate(date);
        onSelectDate(date);
        onClose();
      }
    },
    [onSelectDate, onClose, minDate, maxDate]
  );

  // 캘린더 네비게이션 레이블 포맷 함수
  const formatNavigationLabel = useCallback(({ date }: { date: Date }) => {
    return `${date.getFullYear()}년 ${date.getMonth() + 1}월`;
  }, []);

  // 일자의 "1일" -> "1"로 변경하는 함수
  const formatDay = useCallback((locale: string | undefined, date: Date) => {
    return date.getDate().toString();
  }, []);

  return (
    <BottomSheet height={height} className={className} isOpen={isOpen} onClose={onClose}>
      <div className='calendar-container mt-8 mb-8 flex justify-center'>
        <Calendar
          onChange={handleDateChange}
          value={selectedDate}
          navigationLabel={({ date }) => `${date.getFullYear()}년 ${date.getMonth() + 1}월`}
          showNavigation
          showNeighboringMonth
          nextLabel='>'
          next2Label={null}
          prevLabel='<'
          prev2Label={null}
          formatDay={(locale, date) => date.getDate().toString()}
          calendarType='gregory'
          minDate={minDate}
          maxDate={maxDate}
        />
      </div>
    </BottomSheet>
  );
}
