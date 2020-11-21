---
title: Docker and Weave on a RaspberryPI

draft: false

page : false

---
*This post was [originally published on Medium](https://medium.com/@guillaumewuip/docker-and-weave-on-a-raspberrypi-af208d920a82).*

I’m looking for a way to connect a lot of RPI with each other over internet. But I can’t reach them directly (they’re in sub-networks).
So I came over the [weave](https://github.com/zettio/weave) solution.

Weave basically create a virtual network through docker container running anywhere. It really amazing, let’s just [read the docs](https://github.com/zettio/weave).

The problem was that a RaspberryPi isn’t a classic unix machine, docker is not really fully supported.
And docker standard x86–64 images won’t run on the Pi but there is hopefully [arm images](https://registry.hub.docker.com/repos/resin/).

So it take me days to make my RPI and my Mac talking to each other in a weave network. Here’s why:

- I’m absolutely not a linux expert.
- It seems that docker on the PI isn’t fully supported.
- I’m not a docker expert.
- Weave is really young and changes a lot weeks to weeks (actually 0.9.0).
- I found only one blog post for installing weave on the PI.
- I’m on OSX.

# 1. Install Raspbian Jessie on the Pi

I order to use docker on the PI, you actually need to install Raspbian Jessie instead of Raspbian Whezzy.

## Method 1

1. Download a usual Raspbian Whezzy for the [rapsberry download page](http://www.raspberrypi.org/downloads/).

2. Write it to your SD card. And boot. And run `rpi-config` to expand the image to the full SD card.

3. Open `/etc/apt/sources.list` with your editor (VIm of course) and change all the whezzy references to jessie.

4. Update all the things.

    ```
$ sudo apt-get update
$ sudo apt-get -y upgrade
$ sudo apt-get -y dist-upgrade
    ```

    It will take long. Say yes to all except the dphys-swapfile update according to [this post](https://medium.com/@ALGrendel/docker-weave-a-little-cloud-and-a-raspberry-pi-381f73a4376d).

5. Docker on the pi need the 3.16 kernel (see yours whit `uname -a`). So install it:

    ```
$ sudo apt-get install linux-image-rpi
    ```

    The open `/boot/config.txt` and add at the end:

    ```
kernel=vmlinuz-<version>-rpi
    ```

    Where `vmlinuz-<version>-rpi` should be `vmlinuz-3.16.0-4-rpi`. Simply `ls` `/boot/` to check that.

    Reboot: `sudo reboot`. If the pi refuses to reboot, it’s probably that it can’t find the kernel (see my note).
    Simply plug the SD card on your computer and check `config.txt`.
    If everything works fine, you should see 3.16 when doing `uname -a`.

6. Test docker. It shouldn’t raise errors.

    ```
$ sudo docker info
    ```

## Method 2

Use the [raspbian netinstaller](https://github.com/debian-pi/raspbian-ua-netinst).

1. Follow [the docs](https://github.com/debian-pi/raspbian-ua-netinst) to write the installer on your SD card.

2. Before plugging the card in the pi, add in the `installer-config.txt` file at the root of the card the line `release=jessie`.

3. Boot. It will take ~30 minutes for the installer to download jessie.

4. Then ssh into your new PI(user root, password raspbian). Create a sudoer’s user `pi`. Switch to user `pi`.

5. I don’t know why but you don’t need to install the 3.16 kernel as for Method 1, step 5.

6. Test docker. It shouldn’t raise errors.

    ```
$ sudo docker info
    ```

# 2. Compile Weave on the Pi

1. Install dependencies you need to compile weave.

    ```
$ sudo apt-get install -y libpcap-dev mercurial golang-go docker.io make gcc curl
    ```

2. Create a go directory somewhere (let’s say `/home/pi/.go`) and download the weave git repo.

    ```
$ cd ~
$ mkdir .go
$ export GOPATH=~/.go
$ sudo go clean -i net && sudo go install -tags netgo std
$ git clone http://github.com/zettio/weave src/github.com/zettio/weave
$ cd src/github.com/zettio/weave
    ```

3. Then (this is the part that take me days to realise), checkout the repo at the 9 dec 2014 (the date of [this post](https://medium.com/@ALGrendel/docker-weave-a-little-cloud-and-a-raspberry-pi-381f73a4376d)).

    Apparently, the weave team uses the docker `--net=container:id` feature since then and docker.io arm [doesn’t like it](https://github.com/zettio/weave/issues/466).

4. Make

    ```
$ make
    ```

    This will build 2 docker images for the weave script.

    ```
$ sudo ln -s /home/pi/.go/src/github.com/zettio/weave/weave /usr/local/bin/weave
    ```

# 3. Use the same weave version on your computer

The problem is that we will use an old weave version on the PI.
In order to all the weave routers to speak to each other, they must use the same protocol.

So the deal is to build the 09-dec-2014-weave on your computer too. But … I’m on mac and it’s not that easy to build it on mac so I’ve started a Ubuntu VitualBox VM to build this weave docker images.
As I don’t want to do this all the time I’ve push this images on the Docker Hub.

So simply:

1. Get the 09-dec-2014 weave script.

    ```
$ wget https://raw.githubusercontent.com/zettio/weave/4297f688608e6a595e5bdb289512b990e251ade7/weave
    ```

2. Pull my images.

    ```
$ (sudo) docker pull guillaumewuip/weave
$ (sudo) docker pull guillaumewuip/weavedns
    ```

3. Update the weave script to use my images (line 40 and 41 of the weave file)

    ```
IMAGE=guillaumewuip/weave
DNS_IMAGE=guillaumewuip/weavedns
    ```

4. Start weave

    On mac follow [this guide](https://zettio.github.io/weave/boot2docker.html) to start weave in boot2docker. On ubuntu it’s the normal method:

    ```
$ sudo ./weave launch
    ```

5. On your PI.

    ```
$ sudo ./weave launch [IP of your computer]
    ```

And here we go, let’s run some docker container with weave.


# Thoughts

- A great mystery to me is that I need to install the kernel 3.16 on the PI only for the Method 1.

- I’ve try to build weave on ArchLinux on the PI but failed miserably. Apparently because their is no `libpcap-dev` package for arch.

- I’ve pushed an issue on the weave Github repo to share this experience with the weave team.

- The [Hypriot team release a custom raspbian image](http://blog.hypriot.com/heavily-armed-after-major-upgrade-raspberry-pi-with-docker-1-dot-5-0) that comes with docker install (but seems to doesn’t support `--net=container:<id>`). I haven’t try to build the 09-dec-2014-weave on it but it should work.


# Some sources

- https://medium.com/@ALGrendel/docker-weave-a-little-cloud-and-a-raspberry-pi-381f73a4376d
- http://www.le-libriste.fr/2015/01/installer-docker-sur-un-raspberry-pi-tournant-sous-raspbian/ (FR)
- https://github.com/debian-pi/raspbian-ua-netinst
