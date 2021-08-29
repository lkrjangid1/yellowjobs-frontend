import Container from './container'
import useSWR from 'swr'
import { Tweet } from 'react-static-tweets'
import {
  Box,
  IconButton,
  Text,
  Skeleton,
  Button,
  Flex,
  HStack,
  useDisclosure,
  useToast,
} from '@chakra-ui/react'

import Masonry, { ResponsiveMasonry } from 'react-responsive-masonry'
import { useRouter } from 'next/router'
import { useState } from 'react'
import Link from 'next/link'
import { useSession } from 'next-auth/client'
import { useTweets } from '../hooks/useTweets'
import { BsChevronDoubleDown } from 'react-icons/bs'
import { FiShare2 as ShareIcon } from 'react-icons/fi'
import { FiBookmark as SaveIcon } from 'react-icons/fi'

import LoginModal from './login-modal'
import { API_URL } from 'lib/api'
const FEEDBACK_URL = API_URL + '/api/feedback'
export default function TweetList() {
  const [session, loading] = useSession()
  const [pageNo, setPageNo] = useState(1)
  const { query } = useRouter()
  const { data, error, size, setSize, isReachingEnd } = useTweets({ query })
  const { isOpen, onOpen, onClose } = useDisclosure()
  // const data = _data[0]
  const toast = useToast()
  if (error)
    return (
      <Text align="center" my="4">
        failed to load
      </Text>
    )
  if (!data)
    return (
      <Box as="section" my={5}>
        <Container>
          <ResponsiveMasonry
            columnsCountBreakPoints={{ 350: 1, 750: 2, 900: 3 }}
          >
            <Masonry gutter="1.4rem">
              <Skeleton h="20rem" maxW="26rem" w="full" endColor="gray.200" />
              <Skeleton h="22rem" maxW="26rem" w="full" endColor="gray.200" />
              <Skeleton h="20rem" maxW="26rem" w="full" endColor="gray.200" />
              <Skeleton h="20rem" maxW="26rem" w="full" endColor="gray.200" />
              <Skeleton h="20rem" maxW="26rem" w="full" endColor="gray.200" />
              <Skeleton h="20rem" maxW="26rem" w="full" endColor="gray.200" />
              <Skeleton h="20rem" maxW="26rem" w="full" endColor="gray.200" />
              <Skeleton h="20rem" maxW="26rem" w="full" endColor="gray.200" />
              <Skeleton h="20rem" maxW="26rem" w="full" endColor="gray.200" />
            </Masonry>
          </ResponsiveMasonry>
        </Container>
      </Box>
    )

  const handleSaveClick = (tweetObj) => {
    if (!session) {
      return onOpen()
    } else {
      const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: session.user.userId,
          tweetId: tweetObj.tweet_id,
          action: 'save',
          value: 1,
        }),
      }
      return fetch(FEEDBACK_URL, requestOptions).then((response) =>
        toast({
          title: `Saved`,
          status: 'success',
          isClosable: true,
          duration: 2000,
        })
      )
    }
  }

  const showMore = () => {
    setSize(size + 1)
    console.log(size)
  }
  if (data[0].length > 0)
    return (
      <Box as="section" my={5}>
        <Container>
          <ResponsiveMasonry
            columnsCountBreakPoints={{ 350: 1, 750: 2, 900: 3 }}
          >
            <Masonry gutter="1rem">
              {data.map((page, key) => {
                return page.map((tweetObj, index) => (
                  <Box
                    rounded="md"
                    p="4"
                    bg="white"
                    border="1px"
                    borderColor="gray.100"
                  >
                    <Flex justify="flex-end" mb="4">
                      <IconButton
                        size="sm"
                        variant="outline"
                        icon={<ShareIcon />}
                        onClick={() => {
                          if (navigator.share) {
                            navigator.share({
                              text: `Check out this job I found on yellowjobs.org\n`,
                              url: tweetObj.tweet_url,
                            })
                          }

                          const requestOptions = {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({
                              userId: session ? session.user.userId : null,
                              tweetId: tweetObj.tweet_id,
                              action: 'share',
                            }),
                          }
                          fetch(FEEDBACK_URL, requestOptions)
                        }}
                      />
                    </Flex>
                    <Tweet
                      id={tweetObj.tweet_id}
                      ast={tweetObj.tweet_ast}
                      key={index}
                    />
                    <HStack mt="4">
                      <Button
                        color="yellow.400"
                        border="2px"
                        borderColor="yellow.400"
                        _hover={{ bg: 'yellow.400', color: '#FFF' }}
                        variant="outline"
                        w="full"
                        onClick={() => {
                          if (tweetObj.urls[0]) {
                            window.open(tweetObj.urls[0])
                          } else {
                            window.open(tweetObj.tweet_url)
                          }

                          const requestOptions = {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({
                              userId: session ? session.user.userId : null,
                              tweetId: tweetObj.tweet_id,
                              action: 'click',
                            }),
                          }
                          fetch(FEEDBACK_URL, requestOptions)
                        }}
                      >
                        Apply Now
                      </Button>

                      <IconButton
                        size="md"
                        variant="outline"
                        icon={<SaveIcon />}
                        // isDisabled={!session}
                        onClick={() => handleSaveClick(tweetObj)}
                      />
                    </HStack>
                  </Box>
                ))
              })}
            </Masonry>
          </ResponsiveMasonry>
          <Button
            colorScheme="yellow"
            isFullWidth="true"
            size="lg"
            mt="2rem"
            rightIcon={<BsChevronDoubleDown />}
            onClick={showMore}
            disabled={isReachingEnd}
          >
            Load More
          </Button>
          <LoginModal isOpen={isOpen} onClose={onClose} action="saveTweet" />
        </Container>
      </Box>
    )
  else
    return (
      <Box m="2rem">
        <Text align="center" fontSize="4xl">
          Oops!!
        </Text>
        <Text align="center" fontSize="4xl">
          We don't have any data for your selection yet😢
        </Text>
      </Box>
    )
}
