import React, { ForwardedRef, forwardRef, useRef, useState } from 'react';
import { ProductProps } from './Product.props';
import cn from 'classnames';
import styles from './Product.module.css';
import { Card } from '../Card/Card';
import { Rating } from '../Rating/Rating';
import { Tag } from '../Tag/Tag';
import { Button } from '../Button/Button';
import { declOfNum, priceRu } from '@/helpers/helpers';
import { Divider } from '../Divider/Divider';
import { Review } from '../Review/Review';
import { ReviewForm } from '../ReviewForm/ReviewForm';
import { motion } from 'framer-motion';

export const Product = motion(forwardRef(({ product, className, ...props}: ProductProps, ref: ForwardedRef<HTMLDivElement>): JSX.Element => {
  const [isReviewOpened, setIsReviewOpened] = useState<boolean>(false);
  const reviewRef = useRef<HTMLDivElement>(null);
  const scrollToReview = () => {
    setIsReviewOpened(true);
    reviewRef.current?.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });
    reviewRef.current?.focus();
  };

  const variants = {
    visible: { opacity: 1, height: 'auto'},
    hidden: { opacity: 0, height: 0 }
  };
  return (
    <div 
      className={className}
      ref={ref}
      {...props}
    >
      <Card className={styles.product}>
        <div className={styles.logo}>
          <img 
            src={`${process.env.NEXT_PUBLIC_DOMAIN}${product.image}`}
            alt={product.title}
            width={70}
            height={70}
          />
        </div>
        <div className={styles.title}>
          {product.title}
        </div>
        <div className={styles.price}>
          {priceRu(product.price)}
          {product.oldPrice && (
            <Tag 
              color='green'
              className={styles.oldPrice}
            >
              {priceRu(product.price - product.oldPrice)}
            </Tag>
          )}
        </div>
        <div className={styles.credit}>
          {priceRu(product.credit)}/<span className={styles.month}>мес</span>
        </div>
        <div className={styles.rating}>
          <Rating rating={product.reviewAvg ?? product.initialRating}/>
        </div>
        <div className={styles.tags}>
          {product.categories.map(c => (
            <Tag 
              key={c} 
              color='ghost'
              className={styles.category}
            >
              {c}
            </Tag>
          ))}
        </div>
        <div
          className={styles.priceTitle}
          aria-hidden={true}
        >
          цена
        </div>
        <div
          className={styles.creditTitle}
          aria-hidden={true}
        >
          кредит
        </div>
        <div className={styles.rateTitle}>
          <a 
            href='#ref'
            onClick={scrollToReview}
          >
            {product.reviewCount} {declOfNum(product.reviewCount, ["отзыв", 'отзыва', 'отзывов'])}
          </a>
        </div>
        <Divider className={styles.hr}/>
        <div className={styles.description}>
          {product.description}
        </div>
        <div className={styles.feature}>
          {product.characteristics.map(c => (
            <div 
              className={styles.characterictics}
              key={c.name}
            >
              <span className={styles.charactericticsName}>
                {c.name}
              </span>
              <span className={styles.charactericticsDots}>
              </span>
              <span className={styles.charactericticsValue}>
                {c.value}
              </span>
            </div>
          ))}
        </div>
        <div className={styles.advBlock}>
          {product.advantages && (
            <div className={styles.advantages}>
              <div className={styles.advTitle}>
                Преимущества
              </div>
              <div>{product.advantages}</div>
            </div>
          )}
          {product.disadvantages && (
            <div className={styles.disadvantages}>
              <div className={styles.advTitle}>
                Недостатки
              </div>
              <div>{product.disadvantages}</div>
            </div>
          )}
        </div>
        <Divider className={cn(styles.hr, styles.hr2)}/>
        <div className={styles.actions}>
          <Button appearance='primary'>
            Узнать подробнее
          </Button>
          <Button 
            appearance='ghost'
            arrow={!isReviewOpened ? 'right' : 'down'}
            className={styles.reviewButton}
            onClick={() => setIsReviewOpened(!isReviewOpened)}
            aria-expanded={isReviewOpened}
          >
            Читать отзывы
          </Button>
        </div>
      </Card>
      <motion.div
        animate={isReviewOpened ? 'visible' : 'hidden'}
        variants={variants}
        initial='hidden'
      >
        <Card 
          color='blue'
          className={cn(styles.reviews)}
          ref={reviewRef}
          tabIndex={isReviewOpened ? 0 : -1}
        >
          {product.reviews.map(r => (
            <div key={r._id}>
              <Review key={r._id} review={r}/>
              <Divider />
            </div>
          ))}
          <ReviewForm
            productId={product._id}
            isOpened={isReviewOpened}
          />
        </Card>
      </motion.div>
    </div>
  );
}));
